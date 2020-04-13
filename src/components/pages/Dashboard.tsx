import React, { useState, useEffect, useContext } from 'react';
import { RootObject, BaseResponseObject, DataResponseObject } from '../../spamtitan/types';
import { AuthContext } from '../../AuthContext';
import { SuccessLevel, Notice, appendNotice, NoticeType } from '../structure/pre-styled/Notice';
import { responseIsError } from '../../spamtitan/API';
import { Line, ChartData } from 'react-chartjs-2';
import chartjs from 'chart.js';


interface ScanSummary extends RootObject {
  domain: null,
  domain_group: null,
  period: {
      start_date: string,
      end_date: string,
  },
  clean_messages: number,
  spam_messages: number,
  virus_messages: number,
  banned_messages: number,
  invalid_recipients: number,
  rbl_reject: number,
  helo_reject: number,
}

interface Notices {
  notices: NoticeType,
  successLevel: SuccessLevel
}

const formatDate = (date: Date): string => {
  const m = (date.getUTCMonth() + "").padStart(2, '0');
  const d = (date.getUTCDate() + "").padStart(2, '0');
  return `${date.getUTCFullYear()}-${m}-${d}`;
}

const dateSubDays = (amountDays: number): number => {
  return Date.now() - (
    amountDays *
    24 /*hours*/ *
    60 /*min*/ *
    60 /*sec*/ *
    1000 /*msec*/
  );
}

export const Dashboard: React.FC = () => {
  const [notices, setNotices] = useState<Notices>({ notices: ['Loading...'], successLevel: SuccessLevel.notice });
  const [lastSevenDays, setLastSevenDays] = useState<ScanSummary[]>([]);
  const [data, setData] = useState<ChartData<chartjs.ChartData>>({});
  const { api } = useContext(AuthContext);

  useEffect(() => {
    Promise.all([0, 1, 2, 3, 4, 5, 6].map((num) => {
      const start = new Date(dateSubDays(num + 1));
      const end = new Date(dateSubDays(num));
      return api.query<ScanSummary>('GET', `reports/scan-summary?start=${formatDate(start)}&end=${formatDate(end)}&validation_errors=On`);
    })).then((responses: BaseResponseObject<ScanSummary>[]) => {
      setNotices({ notices: [], successLevel: SuccessLevel.notice});
      responses.forEach(response => {
        if (responseIsError(response)) {
          console.log(response.error);
          setNotices(n => ({
            successLevel: SuccessLevel.error,
            notices: appendNotice(n.notices, response.error),
          }));
        }
      });
      setLastSevenDays(responses.map(response => (response as DataResponseObject<ScanSummary>).object))
    }).catch(err => {
      setNotices({
        notices: err,
        successLevel: SuccessLevel.warning,
      });
    });
  }, [api])

  useEffect(() => {
    const d = {
      labels: lastSevenDays.map((stats: ScanSummary) => stats.period.start_date),
      datasets: [
        {
          label: 'Spam Last 7 days',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(0,0,255,1)',
          pointBorderColor: 'rgba(0,0,255,1)',
          pointBackgroundColor: '#fff',
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          data: lastSevenDays.map((stats: ScanSummary) => stats.spam_messages ?? 0),
        }
      ]
    };
    setData(d);
  }, [lastSevenDays]);

  return (
    <div className="flex flex-col">
      <div className="m-5">
        <Notice errors={notices.notices} successLevel={notices.successLevel} />
        <Line data={data} />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Container from '../structure/Container';
import { AuthStatusProps } from '../../types';
import { Section } from '../structure/Section';
import Breadcrumbs from '../structure/Breadcrumbs';
import Button from '../structure/pre-styled/Button';
import Label from '../structure/pre-styled/Label';
import TextInput from '../structure/pre-styled/TextInput';

interface Props extends AuthStatusProps { }

const SystemInfoSection: React.FunctionComponent = () => {
  const [port, setPort] = useState(0);
  const [version, setVersion] = useState({spamtitan_version: "7.08", api_version: "3.0.0"});

  const onClick = () => {
    setPort(Math.ceil(Math.random() * 30000 + 10000));
  }

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between mb-5">
        <div className="flex justify-start border bg-gray-100 border-gray-300 p-2">
          <div className="pr-6">
            <Label>SpamTitan Version</Label>
            <TextInput className="w-20" readOnly value={version.spamtitan_version} />
          </div>
          <div>
            <Label>API Version</Label>
            <TextInput className="w-20" readOnly value={version.api_version} />
          </div>
        </div>
      </div>
      <div className="mb-5">
        <Label>Support Port</Label>
        <div className="flex justify-between content-center">
          <TextInput className="mr-2" readOnly={true} type="number" value={port} />
          <Button onClick={onClick}>Open Connection</Button>
        </div>
      </div>
    </div>
  );
}

const LicenseSection: React.FunctionComponent = () => {
  const [license, setLicense] = useState<string>('');

  useEffect(() => setLicense('STE-5-0000-123456'), []);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <Label>License:</Label>
        <TextInput readOnly={true} placeholder="License loading..." value={license} />
        <div className="w-1/2 justify-between flex content-center">
          <Button>Download license</Button>
          <Button>Upload new license</Button>
        </div>
      </div>
    </div>
  );
}

export default (props: Props) => {
  return (
    <Container>
      <Breadcrumbs>
        <Breadcrumbs.Item name="System" link="/system" />
      </Breadcrumbs>
      <Section title="System Info" tagline="Some basic information on the system." expanded={true}>
        <SystemInfoSection />
      </Section>
      <Section title="License" tagline="Manage the license of your SpamTitan system.">
        <LicenseSection />
      </Section>
    </Container>
  )
}

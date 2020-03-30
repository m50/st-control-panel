export type Action = 'quarantine' | 'reject' | 'passtag'

export interface Policy {
  id: number,
  policy_name: string,
  banned_subject_tag: string,
  sandbox: 'Y' | 'N' | boolean,
  archive_clean_mail: boolean,
  spam: {
    enabled: boolean,
    score: number,
    discard_score: number,
    add_headers: boolean,
    action: Action,
    send_ndr: boolean,
  },
  virus: {
    enabled: boolean,
    action: Action,
  },
  banned: {
    enabled: boolean,
    action: Action,
  },
  qreport: {
    enabled: boolean,
    frequency: 'D' | 'WD' | 'M' | 'N',
    type: 'N' | 'A' | 'NX' | 'AX',
    language: 'cs_cz' | 'zh_cn' | 'da_dk' | 'nl_nl' |
              'en_us' | 'fr_fr' | 'de_de' | 'he_il' | 'it_it' |
              'ja_jp' | 'nb_no' | 'pl_pl' | 'pt_br' | 'ru_ru' |
              'es_es' | 'sv_se' | 'th_th' | 'tr_tr',
    exclude_score: number,
  }
}


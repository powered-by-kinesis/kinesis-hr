export enum Currency {
  USD = 'USD',
  IDR = 'IDR',
  JPY = 'JPY',
  SGD = 'SGD',
  MYR = 'MYR',
  THB = 'THB',
  VND = 'VND',
  PHP = 'PHP',
  HKD = 'HKD',
  TWD = 'TWD',
  CNY = 'CNY',
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',
  AUD = 'AUD',
  NZD = 'NZD',
  MXN = 'MXN',
  BRL = 'BRL',
  INR = 'INR',
  ZAR = 'ZAR',
}

export const CurrencyOptions = [
  {
    label: 'USD',
    value: Currency.USD,
  },
  {
    label: 'IDR',
    value: Currency.IDR,
  },
  {
    label: 'JPY',
    value: Currency.JPY,
  },
  {
    label: 'SGD',
    value: Currency.SGD,
  },
  {
    label: 'MYR',
    value: Currency.MYR,
  },
  {
    label: 'THB',
    value: Currency.THB,
  },
  {
    label: 'VND',
    value: Currency.VND,
  },
  {
    label: 'PHP',
    value: Currency.PHP,
  },
  {
    label: 'HKD',
    value: Currency.HKD,
  },
  {
    label: 'TWD',
    value: Currency.TWD,
  },
  {
    label: 'CNY',
    value: Currency.CNY,
  },
  {
    label: 'EUR',
    value: Currency.EUR,
  },
  {
    label: 'GBP',
    value: Currency.GBP,
  },
  {
    label: 'CHF',
    value: Currency.CHF,
  },
  {
    label: 'AUD',
    value: Currency.AUD,
  },
  {
    label: 'NZD',
    value: Currency.NZD,
  },
  {
    label: 'MXN',
    value: Currency.MXN,
  },
  {
    label: 'BRL',
    value: Currency.BRL,
  },
  {
    label: 'INR',
    value: Currency.INR,
  },
  {
    label: 'ZAR',
    value: Currency.ZAR,
  },
];

export const getCurrencyLabel = (currency: Currency) => {
  switch (currency) {
    case Currency.USD:
      return 'USD';
    case Currency.IDR:
      return 'IDR';
    case Currency.JPY:
      return 'JPY';
    case Currency.SGD:
      return 'SGD';
    case Currency.MYR:
      return 'MYR';
    case Currency.THB:
      return 'THB';
    case Currency.VND:
      return 'VND';
    case Currency.PHP:
      return 'PHP';
    case Currency.HKD:
      return 'HKD';
    case Currency.TWD:
      return 'TWD';
    case Currency.CNY:
      return 'CNY';
    case Currency.EUR:
      return 'EUR';
    case Currency.GBP:
      return 'GBP';
    case Currency.CHF:
      return 'CHF';
    case Currency.AUD:
      return 'AUD';
    case Currency.NZD:
      return 'NZD';
    case Currency.MXN:
      return 'MXN';
    case Currency.BRL:
      return 'BRL';
    case Currency.INR:
      return 'INR';
    case Currency.ZAR:
      return 'ZAR';
    default:
      return 'Unknown';
  }
};

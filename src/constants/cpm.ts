/** Cost per million... views? */
const cpms: {
    [country: string]: {
        lowerBound: number;
        upperBound: number;
    };
} = {
    Afghanistan: {
        lowerBound: 3.11,
        upperBound: 9.33,
    },
    'Åland Islands': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Albania: {
        lowerBound: 0.74,
        upperBound: 2.22,
    },
    Algeria: {
        lowerBound: 2.57,
        upperBound: 7.71,
    },
    'American Samoa': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Andorra: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Angola: {
        lowerBound: 0.15,
        upperBound: 0.45,
    },
    'Antigua and Barbuda': {
        lowerBound: 0.45,
        upperBound: 1.35,
    },
    Argentina: {
        lowerBound: 0.77,
        upperBound: 2.31,
    },
    Armenia: {
        lowerBound: 3.91,
        upperBound: 11.73,
    },
    Aruba: {
        lowerBound: 0.0,
        upperBound: 0.0,
    },
    Australia: {
        lowerBound: 36.21,
        upperBound: 108.63,
    },
    Austria: {
        lowerBound: 16.86,
        upperBound: 50.58,
    },
    Azerbaijan: {
        lowerBound: 0.59,
        upperBound: 1.77,
    },
    Bahamas: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Bahrain: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Bangladesh: {
        lowerBound: 0.7,
        upperBound: 2.1,
    },
    Barbados: {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Belarus: {
        lowerBound: 3.31,
        upperBound: 9.93,
    },
    Belgium: {
        lowerBound: 15.43,
        upperBound: 46.29,
    },
    Belize: {
        lowerBound: 3.0,
        upperBound: 9.0,
    },
    Benin: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Bhutan: {
        lowerBound: 6.3,
        upperBound: 18.9,
    },
    Bolivia: {
        lowerBound: 0.73,
        upperBound: 2.19,
    },
    'Bosnia and Herzegovina': {
        lowerBound: 1.25,
        upperBound: 3.75,
    },
    Botswana: {
        lowerBound: 8.87,
        upperBound: 26.61,
    },
    Brazil: {
        lowerBound: 6.65,
        upperBound: 19.95,
    },
    'Brunei Darussalam': {
        lowerBound: 0.8,
        upperBound: 2.4,
    },
    Bulgaria: {
        lowerBound: 6.83,
        upperBound: 20.49,
    },
    'Burkina Faso': {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Burundi: {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    'Cabo Verde': {
        lowerBound: 1.5,
        upperBound: 4.5,
    },
    Cambodia: {
        lowerBound: 0.52,
        upperBound: 1.56,
    },
    Cameroon: {
        lowerBound: 1.78,
        upperBound: 5.34,
    },
    Canada: {
        lowerBound: 29.15,
        upperBound: 87.45,
    },
    'Cayman Islands': {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    'Central African Republic': {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Chad: {
        lowerBound: 0.0,
        upperBound: 0.0,
    },
    Chile: {
        lowerBound: 0.54,
        upperBound: 1.62,
    },
    China: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Colombia: {
        lowerBound: 7.57,
        upperBound: 22.71,
    },
    Comoros: {
        lowerBound: 3.0,
        upperBound: 9.0,
    },
    Congo: {
        lowerBound: 0.4,
        upperBound: 1.2,
    },
    'Costa Rica': {
        lowerBound: 2.62,
        upperBound: 7.86,
    },
    'Côte d’Ivoire': {
        lowerBound: 2.24,
        upperBound: 6.72,
    },
    Croatia: {
        lowerBound: 1.85,
        upperBound: 5.55,
    },
    Cuba: {
        lowerBound: 1.4,
        upperBound: 4.2,
    },
    Curaçao: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Cyprus: {
        lowerBound: 7.31,
        upperBound: 21.93,
    },
    'Czech Republic': {
        lowerBound: 9.73,
        upperBound: 29.19,
    },
    Czechia: {
        lowerBound: 2.95,
        upperBound: 8.85,
    },
    Denmark: {
        lowerBound: 17.49,
        upperBound: 52.47,
    },
    Djibouti: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Dominica: {
        lowerBound: 0.45,
        upperBound: 1.35,
    },
    'Dominican Republic': {
        lowerBound: 2.67,
        upperBound: 8.01,
    },
    Ecuador: {
        lowerBound: 1.53,
        upperBound: 4.59,
    },
    Egypt: {
        lowerBound: 0.29,
        upperBound: 0.87,
    },
    'El Salvador': {
        lowerBound: 3.03,
        upperBound: 9.09,
    },
    'Equatorial Guinea': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Estonia: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Eswatini: {
        lowerBound: 0.45,
        upperBound: 1.35,
    },
    Ethiopia: {
        lowerBound: 1.01,
        upperBound: 3.03,
    },
    'Faroe Islands': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Fiji: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Finland: {
        lowerBound: 11.29,
        upperBound: 33.87,
    },
    France: {
        lowerBound: 15.53,
        upperBound: 46.59,
    },
    'French Guiana': {
        lowerBound: 0.0,
        upperBound: 0.0,
    },
    'French Polynesia': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Gabon: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Gambia: {
        lowerBound: 2.14,
        upperBound: 6.42,
    },
    Georgia: {
        lowerBound: 3.46,
        upperBound: 10.38,
    },
    Germany: {
        lowerBound: 18.79,
        upperBound: 56.37,
    },
    Ghana: {
        lowerBound: 1.91,
        upperBound: 5.73,
    },
    Gibraltar: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Greece: {
        lowerBound: 6.23,
        upperBound: 18.69,
    },
    Grenada: {
        lowerBound: 4.25,
        upperBound: 12.75,
    },
    Guadeloupe: {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Guam: {
        lowerBound: 2.38,
        upperBound: 7.14,
    },
    Guatemala: {
        lowerBound: 1.14,
        upperBound: 3.42,
    },
    Guinea: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    'Guinea-Bissau': {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Guyana: {
        lowerBound: 4.5,
        upperBound: 13.5,
    },
    Haiti: {
        lowerBound: 3.0,
        upperBound: 9.0,
    },
    Honduras: {
        lowerBound: 3.32,
        upperBound: 9.96,
    },
    'Hong Kong': {
        lowerBound: 17.23,
        upperBound: 51.69,
    },
    Hungary: {
        lowerBound: 6.52,
        upperBound: 19.56,
    },
    Iceland: {
        lowerBound: 4.33,
        upperBound: 12.99,
    },
    India: {
        lowerBound: 0.7,
        upperBound: 2.1,
    },
    Indonesia: {
        lowerBound: 0.2,
        upperBound: 0.6,
    },
    Iran: {
        lowerBound: 5.67,
        upperBound: 17.01,
    },
    Iraq: {
        lowerBound: 0.71,
        upperBound: 2.13,
    },
    Ireland: {
        lowerBound: 18.2,
        upperBound: 54.6,
    },
    'Isle of Man': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Israel: {
        lowerBound: 14.08,
        upperBound: 42.24,
    },
    Italy: {
        lowerBound: 13.66,
        upperBound: 40.98,
    },
    Jamaica: {
        lowerBound: 4.94,
        upperBound: 14.82,
    },
    Japan: {
        lowerBound: 10.53,
        upperBound: 31.59,
    },
    Jersey: {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Jordan: {
        lowerBound: 1.5,
        upperBound: 4.5,
    },
    Kazakhstan: {
        lowerBound: 1.77,
        upperBound: 5.31,
    },
    'South Korea': {
        lowerBound: 8.88,
        upperBound: 26.64,
    },
    'North Korea': {
        lowerBound: 0.3,
        upperBound: 0.9,
    },
    Kuwait: {
        lowerBound: 6.56,
        upperBound: 19.68,
    },
    Kyrgyzstan: {
        lowerBound: 1.23,
        upperBound: 3.69,
    },
    'Lao People’s Democratic Republic': {
        lowerBound: 5.09,
        upperBound: 15.27,
    },
    Latvia: {
        lowerBound: 6.6,
        upperBound: 19.8,
    },
    Lebanon: {
        lowerBound: 1.7,
        upperBound: 5.1,
    },
    Lesotho: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Liberia: {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Libya: {
        lowerBound: 4.69,
        upperBound: 14.07,
    },
    Liechtenstein: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Lithuania: {
        lowerBound: 6.86,
        upperBound: 20.58,
    },
    Luxembourg: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Macao: {
        lowerBound: 1.25,
        upperBound: 3.75,
    },
    Macedonia: {
        lowerBound: 1.27,
        upperBound: 3.81,
    },
    Madagascar: {
        lowerBound: 0.5,
        upperBound: 1.5,
    },
    Malawi: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Malaysia: {
        lowerBound: 1.4,
        upperBound: 4.2,
    },
    Maldives: {
        lowerBound: 2.01,
        upperBound: 6.03,
    },
    Mali: {
        lowerBound: 8.41,
        upperBound: 25.23,
    },
    Malta: {
        lowerBound: 5.34,
        upperBound: 16.02,
    },
    Martinique: {
        lowerBound: 0.0,
        upperBound: 0.0,
    },
    Mauritania: {
        lowerBound: 3.8,
        upperBound: 11.4,
    },
    Mauritius: {
        lowerBound: 7.05,
        upperBound: 21.15,
    },
    Mayotte: {
        lowerBound: 3.0,
        upperBound: 9.0,
    },
    Mexico: {
        lowerBound: 9.51,
        upperBound: 28.53,
    },
    Moldova: {
        lowerBound: 3.8,
        upperBound: 11.4,
    },
    Mongolia: {
        lowerBound: 5.85,
        upperBound: 17.55,
    },
    Montenegro: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Morocco: {
        lowerBound: 0.34,
        upperBound: 1.02,
    },
    Mozambique: {
        lowerBound: 6.78,
        upperBound: 20.34,
    },
    Myanmar: {
        lowerBound: 1.22,
        upperBound: 3.66,
    },
    Namibia: {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Nepal: {
        lowerBound: 2.14,
        upperBound: 6.42,
    },
    'The Netherlands': {
        lowerBound: 17.77,
        upperBound: 53.31,
    },
    'New Caledonia': {
        lowerBound: 1.33,
        upperBound: 3.99,
    },
    'New Zealand': {
        lowerBound: 28.15,
        upperBound: 84.45,
    },
    Nicaragua: {
        lowerBound: 1.92,
        upperBound: 5.76,
    },
    Niger: {
        lowerBound: 6.0,
        upperBound: 18.0,
    },
    Nigeria: {
        lowerBound: 2.89,
        upperBound: 8.67,
    },
    'Northern Mariana Islands': {
        lowerBound: 0.45,
        upperBound: 1.35,
    },
    Norway: {
        lowerBound: 20.17,
        upperBound: 60.51,
    },
    Oman: {
        lowerBound: 3.78,
        upperBound: 11.34,
    },
    Pakistan: {
        lowerBound: 0.59,
        upperBound: 1.77,
    },
    Palestine: {
        lowerBound: 2.5,
        upperBound: 7.5,
    },
    Panama: {
        lowerBound: 1.73,
        upperBound: 5.19,
    },
    'Papua New Guinea': {
        lowerBound: 2.27,
        upperBound: 6.81,
    },
    Paraguay: {
        lowerBound: 2.48,
        upperBound: 7.44,
    },
    Peru: {
        lowerBound: 1.24,
        upperBound: 3.72,
    },
    Philippines: {
        lowerBound: 0.48,
        upperBound: 1.44,
    },
    Poland: {
        lowerBound: 7.67,
        upperBound: 23.01,
    },
    Portugal: {
        lowerBound: 10.32,
        upperBound: 30.96,
    },
    'Puerto Rico': {
        lowerBound: 8.05,
        upperBound: 24.15,
    },
    Qatar: {
        lowerBound: 1.11,
        upperBound: 3.33,
    },
    Réunion: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Romania: {
        lowerBound: 1.85,
        upperBound: 5.55,
    },
    'Russian Federation': {
        lowerBound: 1.45,
        upperBound: 4.35,
    },
    Rwanda: {
        lowerBound: 1.09,
        upperBound: 3.27,
    },
    'Saint Kitts and Nevis': {
        lowerBound: 0.45,
        upperBound: 1.35,
    },
    'Saint Lucia': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    'Saint Pierre and Miquelon': {
        lowerBound: 1.67,
        upperBound: 5.01,
    },
    'Saint Vincent and the Grenadines': {
        lowerBound: 1.33,
        upperBound: 3.99,
    },
    Samoa: {
        lowerBound: 0.0,
        upperBound: 0.0,
    },
    'San Marino': {
        lowerBound: 1.5,
        upperBound: 4.5,
    },
    'Saudi Arabia': {
        lowerBound: 0.33,
        upperBound: 0.99,
    },
    Senegal: {
        lowerBound: 0.8,
        upperBound: 2.4,
    },
    Serbia: {
        lowerBound: 1.2,
        upperBound: 3.6,
    },
    Seychelles: {
        lowerBound: 1.75,
        upperBound: 5.25,
    },
    'Sierra Leone': {
        lowerBound: 3.5,
        upperBound: 10.5,
    },
    Singapore: {
        lowerBound: 17.75,
        upperBound: 53.25,
    },
    'Sint Maarten (Dutch part)': {
        lowerBound: 0.5,
        upperBound: 1.5,
    },
    Slovakia: {
        lowerBound: 0.67,
        upperBound: 2.01,
    },
    Slovenia: {
        lowerBound: 8.28,
        upperBound: 24.84,
    },
    'Solomon Islands': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Somalia: {
        lowerBound: 1.24,
        upperBound: 3.72,
    },
    'South Africa': {
        lowerBound: 10.0,
        upperBound: 30.0,
    },
    'South Sudan': {
        lowerBound: 2.0,
        upperBound: 6.0,
    },
    Spain: {
        lowerBound: 14.22,
        upperBound: 42.66,
    },
    'Sri Lanka': {
        lowerBound: 4.06,
        upperBound: 12.18,
    },
    Sudan: {
        lowerBound: 2.82,
        upperBound: 8.46,
    },
    Suriname: {
        lowerBound: 7.03,
        upperBound: 21.09,
    },
    'Svalbard and Jan Mayen': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Sweden: {
        lowerBound: 13.36,
        upperBound: 40.08,
    },
    Switzerland: {
        lowerBound: 23.13,
        upperBound: 69.39,
    },
    'Syrian Arab Republic': {
        lowerBound: 1.32,
        upperBound: 3.96,
    },
    Taiwan: {
        lowerBound: 0.59,
        upperBound: 1.77,
    },
    Tajikistan: {
        lowerBound: 1.67,
        upperBound: 5.01,
    },
    Tanzania: {
        lowerBound: 1.96,
        upperBound: 5.88,
    },
    Thailand: {
        lowerBound: 0.27,
        upperBound: 0.81,
    },
    'Timor-Leste': {
        lowerBound: 0.67,
        upperBound: 2.01,
    },
    Togo: {
        lowerBound: 1.87,
        upperBound: 5.61,
    },
    'Trinidad and Tobago': {
        lowerBound: 2.39,
        upperBound: 7.17,
    },
    Tunisia: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    Turkey: {
        lowerBound: 3.08,
        upperBound: 9.24,
    },
    Turkmenistan: {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    'Turks and Caicos Islands': {
        lowerBound: 0.45,
        upperBound: 1.35,
    },
    Uganda: {
        lowerBound: 2.22,
        upperBound: 6.66,
    },
    Ukraine: {
        lowerBound: 1.27,
        upperBound: 3.81,
    },
    'United Arab Emirates': {
        lowerBound: 8.13,
        upperBound: 24.39,
    },
    'United Kingdom': {
        lowerBound: 21.59,
        upperBound: 64.77,
    },
    'United States': {
        lowerBound: 32.75,
        upperBound: 98.25,
    },
    Uruguay: {
        lowerBound: 3.17,
        upperBound: 9.51,
    },
    Uzbekistan: {
        lowerBound: 0.94,
        upperBound: 2.82,
    },
    Vanuatu: {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Venezuela: {
        lowerBound: 3.75,
        upperBound: 11.25,
    },
    'Viet Nam': {
        lowerBound: 0.25,
        upperBound: 0.75,
    },
    'Virgin Islands (British)': {
        lowerBound: 1.0,
        upperBound: 3.0,
    },
    'Virgin Islands (U.S.)': {
        lowerBound: 3.29,
        upperBound: 9.87,
    },
    'Western Sahara': {
        lowerBound: 0.35,
        upperBound: 1.05,
    },
    Yemen: {
        lowerBound: 1.11,
        upperBound: 3.33,
    },
    Zambia: {
        lowerBound: 13.0,
        upperBound: 39.0,
    },
    Zimbabwe: {
        lowerBound: 3.0,
        upperBound: 9.0,
    },
};
export default cpms;

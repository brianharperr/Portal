import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

export default function TimezoneSelector(props) {
  const { sx, value, defaultValue } = props;
  return (
    <FormControl sx={{ display: { sm: 'contents' } }}>
        <FormLabel>Timezone</FormLabel>
        <Autocomplete
        size="sm"
        autoHighlight
        isOptionEqualToValue={(option, value) => option.value === value.value}
        options={timezone}
        value={value ?? defaultValue}
        renderOption={(optionProps, option) => (
          <AutocompleteOption {...optionProps}>
            {option.label}
          </AutocompleteOption>
        )}
        slotProps={{
          input: {
            autoComplete: 'new-password', // disable autocomplete and autofill
          },
        }}
      />
    </FormControl>
  );
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const timezone = [
  {
      "label": "Etc/GMT-12",
      "value": "Etc/GMT-12"
  },
  {
      "label": "Etc/GMT-11",
      "value": "Etc/GMT-11"
  },
  {
      "label": "Pacific/Midway",
      "value": "Pacific/Midway"
  },
  {
      "label": "America/Adak",
      "value": "America/Adak"
  },
  {
      "label": "America/Anchorage",
      "value": "America/Anchorage"
  },
  {
      "label": "Pacific/Gambier",
      "value": "Pacific/Gambier"
  },
  {
      "label": "America/Dawson_Creek",
      "value": "America/Dawson_Creek"
  },
  {
      "label": "America/Ensenada",
      "value": "America/Ensenada"
  },
  {
      "label": "America/Los_Angeles",
      "value": "America/Los_Angeles"
  },
  {
      "label": "America/Chihuahua",
      "value": "America/Chihuahua"
  },
  {
      "label": "America/Denver",
      "value": "America/Denver"
  },
  {
      "label": "America/Belize",
      "value": "America/Belize"
  },
  {
      "label": "America/Cancun",
      "value": "America/Cancun"
  },
  {
      "label": "America/Chicago",
      "value": "America/Chicago"
  },
  {
      "label": "Chile/EasterIsland",
      "value": "Chile/EasterIsland"
  },
  {
      "label": "America/Bogota",
      "value": "America/Bogota"
  },
  {
      "label": "America/Havana",
      "value": "America/Havana"
  },
  {
      "label": "America/New_York",
      "value": "America/New_York"
  },
  {
      "label": "America/Caracas",
      "value": "America/Caracas"
  },
  {
      "label": "America/Campo_Grande",
      "value": "America/Campo_Grande"
  },
  {
      "label": "America/Glace_Bay",
      "value": "America/Glace_Bay"
  },
  {
      "label": "America/Goose_Bay",
      "value": "America/Goose_Bay"
  },
  {
      "label": "America/Santiago",
      "value": "America/Santiago"
  },
  {
      "label": "America/La_Paz",
      "value": "America/La_Paz"
  },
  {
      "label": "America/Argentina/Buenos_Aires",
      "value": "America/Argentina/Buenos_Aires"
  },
  {
      "label": "America/Montevideo",
      "value": "America/Montevideo"
  },
  {
      "label": "America/Araguaina",
      "value": "America/Araguaina"
  },
  {
      "label": "America/Godthab",
      "value": "America/Godthab"
  },
  {
      "label": "America/Miquelon",
      "value": "America/Miquelon"
  },
  {
      "label": "America/Sao_Paulo",
      "value": "America/Sao_Paulo"
  },
  {
      "label": "America/St_Johns",
      "value": "America/St_Johns"
  },
  {
      "label": "America/Noronha",
      "value": "America/Noronha"
  },
  {
      "label": "Atlantic/Cape_Verde",
      "value": "Atlantic/Cape_Verde"
  },
  {
      "label": "Europe/Belfast",
      "value": "Europe/Belfast"
  },
  {
      "label": "Africa/Abidjan",
      "value": "Africa/Abidjan"
  },
  {
      "label": "Europe/Dublin",
      "value": "Europe/Dublin"
  },
  {
      "label": "Europe/Lisbon",
      "value": "Europe/Lisbon"
  },
  {
      "label": "Europe/London",
      "value": "Europe/London"
  },
  {
      "label": "UTC",
      "value": "UTC"
  },
  {
      "label": "Africa/Algiers",
      "value": "Africa/Algiers"
  },
  {
      "label": "Africa/Windhoek",
      "value": "Africa/Windhoek"
  },
  {
      "label": "Atlantic/Azores",
      "value": "Atlantic/Azores"
  },
  {
      "label": "Atlantic/Stanley",
      "value": "Atlantic/Stanley"
  },
  {
      "label": "Europe/Amsterdam",
      "value": "Europe/Amsterdam"
  },
  {
      "label": "Europe/Belgrade",
      "value": "Europe/Belgrade"
  },
  {
      "label": "Europe/Brussels",
      "value": "Europe/Brussels"
  },
  {
      "label": "Africa/Cairo",
      "value": "Africa/Cairo"
  },
  {
      "label": "Africa/Blantyre",
      "value": "Africa/Blantyre"
  },
  {
      "label": "Asia/Beirut",
      "value": "Asia/Beirut"
  },
  {
      "label": "Asia/Damascus",
      "value": "Asia/Damascus"
  },
  {
      "label": "Asia/Gaza",
      "value": "Asia/Gaza"
  },
  {
      "label": "Asia/Jerusalem",
      "value": "Asia/Jerusalem"
  },
  {
      "label": "Africa/Addis_Ababa",
      "value": "Africa/Addis_Ababa"
  },
  {
      "label": "Asia/Riyadh89",
      "value": "Asia/Riyadh89"
  },
  {
      "label": "Europe/Minsk",
      "value": "Europe/Minsk"
  },
  {
      "label": "Asia/Tehran",
      "value": "Asia/Tehran"
  },
  {
      "label": "Asia/Dubai",
      "value": "Asia/Dubai"
  },
  {
      "label": "Asia/Yerevan",
      "value": "Asia/Yerevan"
  },
  {
      "label": "Europe/Moscow",
      "value": "Europe/Moscow"
  },
  {
      "label": "Asia/Kabul",
      "value": "Asia/Kabul"
  },
  {
      "label": "Asia/Tashkent",
      "value": "Asia/Tashkent"
  },
  {
      "label": "Asia/Kolkata",
      "value": "Asia/Kolkata"
  },
  {
      "label": "Asia/Katmandu",
      "value": "Asia/Katmandu"
  },
  {
      "label": "Asia/Dhaka",
      "value": "Asia/Dhaka"
  },
  {
      "label": "Asia/Yekaterinburg",
      "value": "Asia/Yekaterinburg"
  },
  {
      "label": "Asia/Rangoon",
      "value": "Asia/Rangoon"
  },
  {
      "label": "Asia/Bangkok",
      "value": "Asia/Bangkok"
  },
  {
      "label": "Asia/Novosibirsk",
      "value": "Asia/Novosibirsk"
  },
  {
      "label": "Etc/GMT+8",
      "value": "Etc/GMT+8"
  },
  {
      "label": "Asia/Hong_Kong",
      "value": "Asia/Hong_Kong"
  },
  {
      "label": "Asia/Krasnoyarsk",
      "value": "Asia/Krasnoyarsk"
  },
  {
      "label": "Australia/Perth",
      "value": "Australia/Perth"
  },
  {
      "label": "Australia/Eucla",
      "value": "Australia/Eucla"
  },
  {
      "label": "Asia/Irkutsk",
      "value": "Asia/Irkutsk"
  },
  {
      "label": "Asia/Seoul",
      "value": "Asia/Seoul"
  },
  {
      "label": "Asia/Tokyo",
      "value": "Asia/Tokyo"
  },
  {
      "label": "Australia/Adelaide",
      "value": "Australia/Adelaide"
  },
  {
      "label": "Australia/Darwin",
      "value": "Australia/Darwin"
  },
  {
      "label": "Pacific/Marquesas",
      "value": "Pacific/Marquesas"
  },
  {
      "label": "Etc/GMT+10",
      "value": "Etc/GMT+10"
  },
  {
      "label": "Australia/Brisbane",
      "value": "Australia/Brisbane"
  },
  {
      "label": "Australia/Hobart",
      "value": "Australia/Hobart"
  },
  {
      "label": "Asia/Yakutsk",
      "value": "Asia/Yakutsk"
  },
  {
      "label": "Australia/Lord_Howe",
      "value": "Australia/Lord_Howe"
  },
  {
      "label": "Asia/Vladivostok",
      "value": "Asia/Vladivostok"
  },
  {
      "label": "Pacific/Norfolk",
      "value": "Pacific/Norfolk"
  },
  {
      "label": "Etc/GMT+12",
      "value": "Etc/GMT+12"
  },
  {
      "label": "Asia/Anadyr",
      "value": "Asia/Anadyr"
  },
  {
      "label": "Asia/Magadan",
      "value": "Asia/Magadan"
  },
  {
      "label": "Pacific/Auckland",
      "value": "Pacific/Auckland"
  },
  {
      "label": "Pacific/Chatham",
      "value": "Pacific/Chatham"
  },
  {
      "label": "Pacific/Tongatapu",
      "value": "Pacific/Tongatapu"
  },
  {
      "label": "Pacific/Kiritimati",
      "value": "Pacific/Kiritimati"
  }
]
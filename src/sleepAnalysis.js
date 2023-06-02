const timezones = {
  "UTC-12:00": "Baker Island",
  "UTC-11:00": "Niue",
  "UTC-10:00": "Hawaii-Aleutian",
  "UTC-09:00": "Alaska",
  "UTC-08:00": "Pacific US",
  "UTC-07:00": "Mountain US",
  "UTC-06:00": "Central US",
  "UTC-05:00": "Eastern US",
  "UTC-04:00": "Atlantic US",
  "UTC-03:00": "Fernando de Noronha",
  "UTC-02:00": "South Georgia",
  "UTC-01:00": "Azores",
  "UTC±00:00": "Greenwich",
  "UTC+01:00": "Central European",
  "UTC+02:00": "Eastern European",
  "UTC+03:00": "Moscow",
  "UTC+04:00": "Gulf",
  "UTC+05:00": "Pakistan",
  "UTC+06:00": "Bangladesh",
  "UTC+07:00": "Indochina",
  "UTC+08:00": "China",
  "UTC+09:00": "Japan",
  "UTC+10:00": "Australian",
  "UTC+11:00": "Solomon Islands",
  "UTC+12:00": "New Zealand",
}

/**
 * 
 */
function getSuggestedTimezone(utcHour) {
  const timezoneNames = [
    "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00",
    "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00", "UTC-01:00",
    "UTC±00:00", "UTC+01:00", "UTC+02:00", "UTC+03:00", "UTC+04:00", "UTC+05:00",
    "UTC+06:00", "UTC+07:00", "UTC+08:00", "UTC+09:00", "UTC+10:00", "UTC+11:00"
  ];
  const index = (utcHour + 18) % 24;
  return timezones[timezoneNames[index]];
}

/**
 * 
 */
function getTimeText(time) {
  return `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`
}

/**
 * 
 */
function generateBarGraph(csv) {
  // Count occurrences of each hour
  const hourCount = Array(24).fill(0);

  csv.forEach((row) => {
    if (row === undefined) {
      return
    }

    const date = new Date(row[0]);
    const hour = date.getUTCHours();
    hourCount[hour]++;
  });

  const max = Math.max(...hourCount)

  const end = (csv[0] || csv[1])[0] || new Date(0)
  const start = (csv[csv.length - 1] || csv[csv.length - 2])[0] || new Date()

  // Generate the bar graph table
  let table = `<h3>Posting Times between ${getTimeText(start)} and ${getTimeText(end)}</h3><p>This shows the frequency of posts, grouped by each hour of the day.<br />The bar with the smallest value is the physical location on earth they are likely to be at.<br />This is because people do not tweet when they sleep, and so the least amount of tweets at that hour is when they sleep, and when they sleep is also where they sleep.</p><table id=\"hours\"><tr id=\"bars\">`;
  for (let i = 0; i < 24; i++) {
    table += `<td><div class="bar" style="height:${hourCount[i] / max * 200}px;"></div></td>`;
  }
  table += "</tr><tr>";
  for (let i = 0; i < 24; i++) {
    table += `<td class="primaryBackground smallText vTop"><center>${i}:00<br/>UTC<div><br/><b>${getSuggestedTimezone(i)}</b></div></center></td>`;
  }
  table += "</tr></table>";

  return table;
}

const sleepAnalysis = document.getElementById('sleepAnalysis')
const barGraphTable = generateBarGraph(csv);
sleepAnalysis.innerHTML += barGraphTable

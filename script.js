var baseTime = null;

// Converts a time in %H:%M to total minutes.
function time_to_slider(time) {
  var hours = time.hour;
  minutes = time.minute;  
  return hours * 60 + minutes;
}

// Converts total minutes into %H:%M
function slider_to_time(total_mins) { 
  hours = Math.floor(total_mins / 60);
  mins = total_mins % 60;
  time = hours + ":" + mins;
  result = luxon.DateTime.fromFormat(time, "H:m");
  return result;
  /*time = str(hours + ":" + mins)
  return time*/
}

function init() {
  $('.timepicker').timepicker({
    'timeFormat': 'H:i',
    'step': 15
  });
  $('#baseTime').on('changeTime', baseTimeEntry);
  
  $('#time2').on('changeTime', time2Entry);
  $('#time3').on('changeTime', time3Entry);
  // Initialise to current time and date
  baseTime = luxon.DateTime.local();
  
  // Set slider
  slider1 = document.getElementById("baseSlider");
  date1 = document.getElementById("baseDate");
  
  date1.addEventListener('input', dateChange);
  slider1.addEventListener('input', baseSlider);
  
  slider2 = document.getElementById("slider2");
  slider2.addEventListener('input', slider2Change);
  
  slider3 = document.getElementById("slider3");
  slider3.addEventListener('input', slider3Change);
  
  date2 = document.getElementById("date2");
  date2.addEventListener('input', date2Change);
  
  date3 = document.getElementById("date3");
  date3.addEventListener('input', date3Change);
  
  updateHome();
  updateZurich();
  updateHongKong();
  
  $("#addcity").autocomplete({source: countries, select: addCity, minLength: 0});
  
  addcity = document.getElementById("addcity");
  addcity.addEventListener("focus", addCityFocus);
}

function addCity(event, ui) {
  console.log(ui.item.label);
  $(this).val('');
  this.blur();
  
  removeMe = document.getElementById("addcity");
  removeMe.remove();
  removeMe = document.getElementById("plush2");
  removeMe.remove();
  
  var str = `<img class='icon' src='images/location.svg' alt='Away' width=32 height=32>
      <h2 class='location'>` + ui.item.label + `</h2>
       <div class='timeinput'>
      <input class='time timepicker' id='time3' type='text' value='00:31' size=4>
       </div>
       <div class='dateinput'>
      <input class='date' type='date' value='2020-02-08' id='date3'><br/>
       </div>
      <input type='range' min='0' max='1440' value='100' step='15' class='slider' id='slider3'/> 
       <span class='extra' id='extradate3'>Tue Feb 8<br/><span class='highlight' id='plusdays2'>(+ 1 day)</span></span>
       <span class='time1'>12:00AM</span>
       <span class='time2'>06:00AM</span>
       <span class='time3'>12:00PM</span>
       <span class='time4'>6:00PM</span>
       <span class='time5'>12:00AM</span>
       
       <h2 class='plus' id='plush2'>+</h2>
         
       <div class='addbtn autocomplete'><input type='text' placeholder='Add City' id='addcity'></div>`;
  
  var element = document.getElementById("main")
  element.insertAdjacentHTML('beforeend', str);
  $("#addcity").autocomplete({source: countries, select: addCity, minLength: 0});
  
  addcity = document.getElementById("addcity");
  addcity.addEventListener("focus", addCityFocus);
  return false;
}

function addCityFocus() {
  $(this).autocomplete("search");
}

function updateHome() {
  var conversion = time_to_slider(baseTime);
  slider1 = document.getElementById("baseSlider");
  slider1.value = conversion;
  
  
  // Set Time Display
  var time = baseTime.toLocaleString(luxon.DateTime.TIME_24_SIMPLE);
  time1 = document.getElementById("baseTime");
  time1.value = time.toString();
  
  // Set Date Display
  date1 = document.getElementById("baseDate");
  date1.value = baseTime.toISODate().toString();
  
  
  // Set Date Mini Display
  extradate = document.getElementById("extradate");
  extradate.innerHTML = baseTime.toFormat("EEE MMM d");
  
  //home_location = document.getElementById("homelocation");
  //home_location.innerHTML = baseTime.zoneName;
    
}

function updateHongKong() {
  adjusted_time = baseTime.setZone("Asia/Hong_Kong");
  adjDate = adjusted_time.toISODate();
  normalDate = baseTime.toISODate();
  
  // update slider 
  var conversion = time_to_slider(adjusted_time);
  slider2 = document.getElementById("slider3");
  slider2.value = conversion;
  
  // update time
  var time = adjusted_time.toLocaleString(luxon.DateTime.TIME_24_SIMPLE);
  time2 = document.getElementById("time3");
  time2.value = time.toString();
  
  // update date
  // Set Date Display
  date2 = document.getElementById("date3");
  date2.value = adjDate.toString();
  
  // Set Date Mini Display
  extradate = document.getElementById("extradate3");
  extradate.innerHTML = adjusted_time.toFormat("EEE MMM d");
  
  var end = luxon.DateTime.fromISO(adjDate);
  var start = luxon.DateTime.fromISO(normalDate);
  difference = end.diff(start, 'days').toObject()['days'];
  if (difference != 0) {
    extradate.innerHTML = adjusted_time.toFormat("EEE MMM d") + "<br/><span class='highlight'>(" + difference + " day)</span>";
  }
  
}

function updateZurich() {
  adjusted_time = baseTime.setZone("Europe/Zurich");
  adjDate = adjusted_time.toISODate();
  normalDate = baseTime.toISODate();
  
  // update slider 
  var conversion = time_to_slider(adjusted_time);
  slider2 = document.getElementById("slider2");
  slider2.value = conversion;
  
  // update time
  var time = adjusted_time.toLocaleString(luxon.DateTime.TIME_24_SIMPLE);
  time2 = document.getElementById("time2");
  time2.value = time.toString();
  
  // update date
  // Set Date Display
  date2 = document.getElementById("date2");
  date2.value = adjDate.toString();
  
  // Set Date Mini Display
  extradate = document.getElementById("extradate2");
  extradate.innerHTML = adjusted_time.toFormat("EEE MMM d");
  
  var end = luxon.DateTime.fromISO(adjDate);
  var start = luxon.DateTime.fromISO(normalDate);
  difference = end.diff(start, 'days').toObject()['days'];
  if (difference != 0) {
    extradate.innerHTML = adjusted_time.toFormat("EEE MMM d") + "<br/><span class='highlight'>(" + difference + " day)</span>";
  }
}

function baseSlider() {
  var value = this.value;
  var time = slider_to_time(value);
  var timeFormatted = time.toLocaleString(luxon.DateTime.TIME_24_SIMPLE);
  time1 = document.getElementById("baseTime");
  baseTime = baseTime.set({hour: time.hour, minute: time.minute});
  time1.value = timeFormatted.toString();
  updateHome();
  updateZurich();
  updateHongKong();
}

function slider2Change() {
  var value = this.value;
  luxon.Settings.defaultZoneName = "Europe/Zurich";
  adjusted = baseTime.setZone("Europe/Zurich");
  var time = slider_to_time(value);
  time = time.set({day: adjusted.day, month: adjusted.month, year: adjusted.year});
  baseTime = time.setZone("Australia/Brisbane");
  luxon.Settings.defaultZoneName = "local";
  updateHome();
  updateZurich();
  updateHongKong();
}

function slider3Change() {
  var value = this.value;
  luxon.Settings.defaultZoneName = "Asia/Hong_Kong";
  adjusted = baseTime.setZone("Asia/Hong_Kong");
  var time = slider_to_time(value);
  time = time.set({day: adjusted.day, month: adjusted.month, year: adjusted.year});
  baseTime = time.setZone("Australia/Brisbane");
  luxon.Settings.defaultZoneName = "local";
  updateHome();
  updateZurich();
  updateHongKong();
}


function baseTimeEntry() {
  result = luxon.DateTime.fromFormat(this.value, "HH:mm");
  baseTime = result;
  var conversion = time_to_slider(result);
  slider1 = document.getElementById("baseSlider");
  slider1.value = conversion;
  updateZurich();
  updateHongKong();
}

function time2Entry() {
  luxon.Settings.defaultZoneName = "Europe/Zurich";
  result = luxon.DateTime.fromFormat(this.value, "HH:mm");
  baseTime = result.setZone("Australia/Brisbane");
  luxon.Settings.defaultZoneName = "local";
  updateHome();
  updateZurich();
  updateHongKong();
}

function time3Entry() {
  luxon.Settings.defaultZoneName = "Asia/Hong_Kong";
  result = luxon.DateTime.fromFormat(this.value, "HH:mm");
  baseTime = result.setZone("Australia/Brisbane");
  luxon.Settings.defaultZoneName = "local";
  updateHome();
  updateZurich();
  updateHongKong();
}


function dateChange() {
  // Set Date Mini Display
  extradate = document.getElementById("extradate");
  result = luxon.DateTime.fromISO(this.value);
  baseTime = baseTime.set({day: result.day, month: result.month, year: result.year});
  extradate.innerHTML = result.toFormat("EEE MMM d");
  updateZurich();
  updateHongKong();
}

function date2Change() {
  // Set Date Mini Display
  luxon.Settings.defaultZoneName = "Europe/Zurich";
  result = luxon.DateTime.fromISO(this.value);
  adjusted = baseTime.setZone("Europe/Zurich");
  result = result.set({hour: adjusted.hour, minute: adjusted.minute});
  baseTime = result.setZone("Australia/Brisbane");
  luxon.Settings.defaultZoneName = "local";
  updateHome();
  updateZurich();
  updateHongKong();
}

function date3Change() {
  // Set Date Mini Display
  luxon.Settings.defaultZoneName = "Asia/Hong_Kong";
  result = luxon.DateTime.fromISO(this.value);
  adjusted = baseTime.setZone("Asia/Hong_Kong");
  result = result.set({hour: adjusted.hour, minute: adjusted.minute});
  baseTime = result.setZone("Australia/Brisbane");
  luxon.Settings.defaultZoneName = "local";
  updateHome();
  updateZurich();
  updateHongKong();
}

/*An array containing all the country names in the world:*/
var countries = 
['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara', 'Africa/Asmera', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Timbuktu', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/ComodRivadavia', 'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Atikokan', 'America/Atka', 'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Buenos_Aires', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Catamarca', 'America/Cayenne', 'America/Cayman', 'America/Chicago', 'America/Chihuahua', 'America/Coral_Harbour', 'America/Cordoba', 'America/Costa_Rica', 'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Ensenada', 'America/Fort_Nelson', 'America/Fort_Wayne', 'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indianapolis', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Jujuy', 'America/Juneau', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Knox_IN', 'America/Kralendijk', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Lower_Princes', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 'America/Mendoza', 'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Montreal', 'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Acre', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 'America/Rio_Branco', 'America/Rosario', 'America/Santa_Isabel', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Shiprock', 'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola', 'America/Vancouver', 'America/Virgin', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'America/Yellowknife', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/South_Pole', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'Arctic/Longyearbyen', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Ashkhabad', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Calcutta', 'Asia/Chita', 'Asia/Choibalsan', 'Asia/Chongqing', 'Asia/Chungking', 'Asia/Colombo', 'Asia/Dacca', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Harbin', 'Asia/Hebron', 'Asia/Ho_Chi_Minh', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Istanbul', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kashgar', 'Asia/Kathmandu', 'Asia/Katmandu', 'Asia/Khandyga', 'Asia/Kolkata', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macao', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Rangoon', 'Asia/Riyadh', 'Asia/Saigon', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Tel_Aviv', 'Asia/Thimbu', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ujung_Pandang', 'Asia/Ulaanbaatar', 'Asia/Ulan_Bator', 'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yangon', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faeroe', 'Atlantic/Faroe', 'Atlantic/Jan_Mayen', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/ACT', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Canberra', 'Australia/Currie', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/LHI', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/NSW', 'Australia/North', 'Australia/Perth', 'Australia/Queensland', 'Australia/South', 'Australia/Sydney', 'Australia/Tasmania', 'Australia/Victoria', 'Australia/West', 'Australia/Yancowinna', 'Brazil/Acre', 'Brazil/DeNoronha', 'Brazil/East', 'Brazil/West', 'CET', 'CST6CDT', 'Canada/Atlantic', 'Canada/Central', 'Canada/Eastern', 'Canada/Mountain', 'Canada/Newfoundland', 'Canada/Pacific', 'Canada/Saskatchewan', 'Canada/Yukon', 'Chile/Continental', 'Chile/EasterIsland', 'Cuba', 'EET', 'EST', 'EST5EDT', 'Egypt', 'Eire', 'Etc/GMT', 'Etc/GMT+0', 'Etc/GMT+1', 'Etc/GMT+10', 'Etc/GMT+11', 'Etc/GMT+12', 'Etc/GMT+2', 'Etc/GMT+3', 'Etc/GMT+4', 'Etc/GMT+5', 'Etc/GMT+6', 'Etc/GMT+7', 'Etc/GMT+8', 'Etc/GMT+9', 'Etc/GMT-0', 'Etc/GMT-1', 'Etc/GMT-10', 'Etc/GMT-11', 'Etc/GMT-12', 'Etc/GMT-13', 'Etc/GMT-14', 'Etc/GMT-2', 'Etc/GMT-3', 'Etc/GMT-4', 'Etc/GMT-5', 'Etc/GMT-6', 'Etc/GMT-7', 'Etc/GMT-8', 'Etc/GMT-9', 'Etc/GMT0', 'Etc/Greenwich', 'Etc/UCT', 'Etc/UTC', 'Etc/Universal', 'Etc/Zulu', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belfast', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Nicosia', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Saratov', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Tiraspol', 'Europe/Ulyanovsk', 'Europe/Uzhgorod', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich', 'Factory', 'GB', 'GB-Eire', 'GMT', 'GMT+0', 'GMT-0', 'GMT0', 'Greenwich', 'HST', 'Hongkong', 'Iceland', 'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Iran', 'Israel', 'Jamaica', 'Japan', 'Kwajalein', 'Libya', 'MET', 'MST', 'MST7MDT', 'Mexico/BajaNorte', 'Mexico/BajaSur', 'Mexico/General', 'NZ', 'NZ-CHAT', 'Navajo', 'PRC', 'PST8PDT', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Chuuk', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Johnston', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Pohnpei', 'Pacific/Ponape', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Samoa', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Truk', 'Pacific/Wake', 'Pacific/Wallis', 'Pacific/Yap', 'Poland', 'Portugal', 'ROC', 'ROK', 'Singapore', 'Turkey', 'UCT', 'US/Alaska', 'US/Aleutian', 'US/Arizona', 'US/Central', 'US/East-Indiana', 'US/Eastern', 'US/Hawaii', 'US/Indiana-Starke', 'US/Michigan', 'US/Mountain', 'US/Pacific', 'US/Pacific-New', 'US/Samoa', 'UTC', 'Universal', 'W-SU', 'WET', 'Zulu']
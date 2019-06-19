function show_login_form() {
  $('.dialog_window_holder.login_window').show();
  $('.login_window #password').focus();
}
function hide_login_form() {
  $('.dialog_window_holder.login_window').hide();
}
function start_login(rme) {
  if (rme) {
    $cookies.create('login', $eva.login, 365, '/ui/');
    $cookies.create('password', $eva.password, 365, '/ui/');
  }
  $eva.start();
}
function after_login() {
  $('#login_error').hide();
  hide_login_form();
  $('.log_block').show();
  $('.page_content').show();
  enableScroll();
  $('.log_block .nano').nanoScroller({scroll: 'bottom'});
  $eva.log_start(20);
  $('.farms_holder').html('');
  var greenHouseNumber = 2;
  for (var i = 1; i <= greenHouseNumber; i++) {
    createFarm(i);
  }
  $eva.watch('sensor:greenhouse*/env/temp', ui_set_sensor);
  $eva.watch('sensor:greenhouse*/env/hum', ui_set_sensor);
  $eva.watch('sensor:greenhouse*/env/soilm', ui_set_sensor);
  $eva.watch('sensor:greenhouse*/env/ldr', ui_set_bright);
  $eva.watch('unit:greenhouse*/lamp', ui_set_lamp);
  $eva.watch('unit:greenhouse*/pump', ui_set_water);
}
function failed_login(err) {
  clear_cookies();
  if (err) {
    $('#login_error').html(err.message);
  } else {
    $('#login_error').html('');
  }
  $('#password').value = '';
  $('.login_window #login').focus();
  $('#login_error').show();
  show_login_form();
}
function enableScroll(e) {
  var time = 1;
  if (e) {
    time = e;
  }
  setTimeout(function() {
    $('.nano').nanoScroller();
  }, time);
}
function clear_cookies() {
  $cookies.erase('login', '/ui/');
  $cookies.erase('password', '/ui/');
}
function logout() {
  clear_cookies();
  $eva.stop();
  document.location.reload();
}
var openWater = [];
function start_watering(element, time) {
  if (openWater[element.id] != null) {
    clearTimeout(openWater[element.id]);
    clearInterval(openWater[element.id + 'timer']);
  }
  $('#' + element.id + '+label .circleFill').css('transition-duration', '0s');
  $('#' + element.id + '+label .circleFill').css('stroke-dashoffset', '177');
  $('#' + element.id + '+label .borderFill0').css('transition-duration', '0s');
  $('#' + element.id + '+label .borderFill0').css('stroke-dashoffset', '335');
  $('#' + element.id + '+label .borderFill1').css('transition-duration', '0s');
  $('#' + element.id + '+label .borderFill1').css('stroke-dashoffset', '360');
  $('#' + element.id + '+label .borderFill2').css('transition-duration', '0s');
  $('#' + element.id + '+label .borderFill2').css('stroke-dashoffset', '385');
  if (openWater[element.id + 'clock_timer'] != null) {
    clearTimeout(openWater[element.id + 'clock_timer']);
  }
  setTimeout(function() {
    $('#' + element.id + '+label .circleFill').css(
      'transition-duration',
      time + 's'
    );
    $('#' + element.id + '+label .circleFill').attr(
      'class',
      'circleFill filled'
    );
    $('#' + element.id + '+label .circleFill').css('stroke-dashoffset', '');
    $('#' + element.id + '+label .borderFill0').css(
      'transition-duration',
      time + 's'
    );
    $('#' + element.id + '+label .borderFill0').attr(
      'class',
      'borderFill0 filled'
    );
    $('#' + element.id + '+label .borderFill0').css('stroke-dashoffset', '');
    $('#' + element.id + '+label .borderFill1').css(
      'transition-duration',
      time + 's'
    );
    $('#' + element.id + '+label .borderFill1').attr(
      'class',
      'borderFill1 filled'
    );
    $('#' + element.id + '+label .borderFill1').css('stroke-dashoffset', '');
    $('#' + element.id + '+label .borderFill2').css(
      'transition-duration',
      time + 's'
    );
    $('#' + element.id + '+label .borderFill2').attr(
      'class',
      'borderFill2 filled'
    );
    $('#' + element.id + '+label .borderFill2').css('stroke-dashoffset', '');
    openWater[element.id + 'clock_timer'] = setTimeout(function() {
      $('#' + element.id + '+label .circleFill').css('transition-duration', '');
      $('#' + element.id + '+label .circleFill').attr(
        'class',
        'circleFill circleFillFast'
      );
      $('#' + element.id + '+label .borderFill0').css(
        'transition-duration',
        ''
      );
      $('#' + element.id + '+label .borderFill0').attr(
        'class',
        'borderFill0 circleFillFast'
      );
      $('#' + element.id + '+label .borderFill1').css(
        'transition-duration',
        ''
      );
      $('#' + element.id + '+label .borderFill1').attr(
        'class',
        'borderFill1 circleFillFast'
      );
      $('#' + element.id + '+label .borderFill2').css(
        'transition-duration',
        ''
      );
      $('#' + element.id + '+label .borderFill2').attr(
        'class',
        'borderFill2 circleFillFast'
      );
      openWater[element.id + 'clock_timer'] = null;
    }, time * 1000);
  }, 100);
  var seconds_left = time;
  $(element)
    .next('label')
    .find('.water_timer')
    .html(seconds_left);
  openWater[element.id + 'timer'] = setInterval(function() {
    $(element)
      .next('label')
      .find('.water_timer')
      .html(--seconds_left);
    if (seconds_left <= 0) {
      clearInterval(openWater[element.id + 'timer']);
      $(element)
        .next('label')
        .find('.water_timer')
        .html('');
    }
  }, 1000);
  openWater[element.id] = setTimeout(function() {
    $(element)
      .parent()
      .find('input[value=0]')
      .prop('checked', true);
    openWater[element.id] = null;
  }, time * 1000);
}
function stop_watering_timer(element) {
  if (!element) return;
  clearTimeout(openWater[element.id]);
  clearInterval(openWater[element.id + 'timer']);
  clearTimeout(openWater[element.id + 'clock_timer']);
  $(element)
    .next('label')
    .find('.water_timer')
    .html('');
  $('#' + element.id + '+label .circleFill').css('transition-duration', '0s');
  $('#' + element.id + '+label .circleFill').css('stroke-dashoffset', '177');
  $('#' + element.id + '+label .borderFill0').css('transition-duration', '0s');
  $('#' + element.id + '+label .borderFill0').css('stroke-dashoffset', '335');
  $('#' + element.id + '+label .borderFill1').css('transition-duration', '0s');
  $('#' + element.id + '+label .borderFill1').css('stroke-dashoffset', '360');
  $('#' + element.id + '+label .borderFill2').css('transition-duration', '0s');
  $('#' + element.id + '+label .borderFill2').css('stroke-dashoffset', '385');
}
function sendWateringAction(event, id) {
  event.preventDefault();
  var target = event.currentTarget;
  if (target.value == 1) {
    $eva.call('run', 'control/start_manual_watering', {a: id});
  } else {
    $eva.call('run', 'automation/stop_pump', {a: id});
    stopTimer(id);
  }
}
function stopTimer(id) {
  $eva
    .call('clear', 'lvar:greenhouse' + id + '/timers/manual_watering')
    .catch(function(err) {});
}
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = String(a.getHours());
  var min = String(a.getMinutes());
  var sec = String(a.getSeconds());
  if (hour.length < 2) hour = '0' + hour;
  if (min.length < 2) min = '0' + min;
  if (sec.length < 2) sec = '0' + sec;
  var time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}
function process_log_record(value) {
  var log_class = '';
  if (value.l == 10) {
    log_class = 'debug_log';
  } else if (value.l == 30) {
    log_class = 'warning_log';
  } else if (value.l == 40) {
    log_class = 'error_log';
  }
  var d = timeConverter(value.t);
  $('.log_block .nano-content').append(
    '<p class="' +
      log_class +
      '">' +
      d +
      ' ' +
      value.p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') +
      '/' +
      value.h
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') +
      ' ' +
      value.msg
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') +
      '</p>'
  );
  $('.log_block .nano').nanoScroller();
  $('.log_block .nano').nanoScroller({scroll: 'bottom'});
}
function ui_set_bright(state) {
  $('#' + $.escapeSelector(state.oid)).attr('data-state', state.value);
}
function ui_set_lamp(state) {
  $(
    '#' + $.escapeSelector(state.oid) + ' input[value=' + state.status + ']'
  ).prop('checked', true);
}
function sendLampAction(event, id) {
  event.preventDefault();
  var value = $('#' + event.target.getAttribute('for')).val();
  $eva.call('action', 'unit:greenhouse' + id + '/lamp', {s: value});
}
function ui_set_water(state) {
  $(
    '#' + $.escapeSelector(state.oid) + ' input[value=' + state.status + ']'
  ).prop('checked', true);
  if (state.status == state.nstatus) {
    if (state.nstatus == 1) {
      $('#' + $.escapeSelector(state.oid) + ' label').addClass('hidden_timer');
      setTimeout(function() {
        var time = Math.round(
          $eva.expires_in(state.group + '/timers/manual_watering')
        );
        if (time > -1) {
          $('#' + $.escapeSelector(state.oid) + ' label').removeClass(
            'hidden_timer'
          );
          start_watering(
            $('#' + $.escapeSelector(state.oid) + ' input')[0],
            time
          );
        }
        openWater[state.oid + 'timer'] = setInterval(function() {
          var time_watering = Math.round(
            $eva.expires_in(state.group + '/timers/manual_watering')
          );
          if (time_watering < 0) {
            stop_watering_timer(
              $('#' + $.escapeSelector(state.oid) + ' input')[0]
            );
            $('#' + $.escapeSelector(state.oid) + ' label').addClass(
              'hidden_timer'
            );
          } else if (
            time_watering >
            +$(
              '#' + $.escapeSelector(state.oid) + ' input + label .water_timer'
            ).html()
          ) {
            $('#' + $.escapeSelector(state.oid) + ' label').removeClass(
              'hidden_timer'
            );
            $('#' + $.escapeSelector(state.oid) + ' input[value=1]').prop(
              'checked',
              true
            );
            start_watering(
              $('#' + $.escapeSelector(state.oid) + ' input')[0],
              time_watering
            );
          }
        }, 500);
      }, 100);
    } else {
      stop_watering_timer($('#' + $.escapeSelector(state.oid) + ' input')[0]);
      clearInterval(openWater[state.oid + 'timer']);
    }
  }
}
function ui_set_sensor(state) {
  var el = $('#' + $.escapeSelector(state.oid));
  el.find('.sensor_value').attr('data-value', state.value);
  var delta = el.attr('data-max') - el.attr('data-min');
  var pos = (100 * (state.value - el.attr('data-min'))) / delta;
  pos = Math.max(0, Math.min(pos, 100));
  pos = 'calc(' + pos + '% - ' + Math.floor(pos / 12.5) + 'px)';
  el.find('.sensor_value').css('left', pos);
}

function createFarm(id) {
  if ($('#greenhouse' + id).length > 0) {
    console.log('%c Farm already exist ' + id, 'color: #f00');
    return;
  }
  var newFarm =
    '<div class="farm_block" id="greenhouse' +
    id +
    '">' +
    '<div class="farm_name">Greenhouse <span>' +
    id +
    '</span></div>' +
    '<div class="control_block">' +
    '<div class="light_holder">' +
    '<div id="sensor:greenhouse' +
    id +
    '/env/ldr" class="bright_sensor" data-state="0"></div>' +
    '<div id="unit:greenhouse' +
    id +
    '/lamp" class="lightswitcher">' +
    '<input id="greenhouse' +
    id +
    '_light_radio1" type="radio" checked="true" name="greenhouse' +
    id +
    '_lightswitcher" value="1">' +
    '<label for="greenhouse' +
    id +
    '_light_radio1"><div></div>ON</label>' +
    '<input id="greenhouse' +
    id +
    '_light_radio2" type="radio" name="greenhouse' +
    id +
    '_lightswitcher" value="0">' +
    '<label for="greenhouse' +
    id +
    '_light_radio2"><div></div>OFF</label>' +
    '</div>' +
    '</div>' +
    '<div class="water_holder">' +
    '<div id="unit:greenhouse' +
    id +
    '/pump" class="waterswitcher">' +
    '<input id="greenhouse' +
    id +
    '_water_radio1" type="radio" name="greenhouse' +
    id +
    '_waterswitcher" value="1">' +
    '<label for="greenhouse' +
    id +
    '_water_radio1">' +
    '<div></div>' +
    '<div class="water_timer"></div>' +
    '<div class="time_circle">' +
    '<svg><circle cx="63" cy="63" r="57" stroke="#fff" stroke-width="4" fill="#ccc"></circle></svg>' +
    '<svg class="circleFill"><circle cx="63" cy="63" r="28" stroke="rgba(255, 255, 255, 0.6)" stroke-width="56" fill="none"></circle></svg>' +
    '<svg><circle cx="63" cy="63" r="57" stroke="#999" stroke-width="12" fill="none" stroke-dasharray="2 4"></circle></svg>' +
    '<svg class="borderFill0"><circle cx="63" cy="63" r="53" stroke="#ccc" stroke-width="4" fill="none"></circle></svg>' +
    '<svg class="borderFill1"><circle cx="63" cy="63" r="57" stroke="#fff" stroke-width="4" fill="none"></circle></svg>' +
    '<svg class="borderFill2"><circle cx="63" cy="63" r="61" stroke="#e6e6e6" stroke-width="4.2" fill="none"></circle></svg>' +
    '</div>' +
    '<div class="stop_timer" onclick="stopTimer(' +
    id +
    ')">&#10074;&#10074</div>' +
    'On' +
    '</label>' +
    '<input id="greenhouse' +
    id +
    '_water_radio2" type="radio" checked="true" name="greenhouse' +
    id +
    '_waterswitcher" value="0">' +
    '<label for="greenhouse' +
    id +
    '_water_radio2"><div></div>Off</label>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="sensors_block">' +
    '<div class="sensor_holder temp_holder">' +
    '<div class="temp_info_holder">' +
    '<div class="sensor_header">Air temperature<span>&deg;C</span></div>' +
    '<div id="sensor:greenhouse' +
    id +
    '/env/temp" class="sensor_info" data-min="0" data-max="50">' +
    '<div class="sensor_value" data-value="0"></div>' +
    '</div>' +
    '</div>' +
    '<div class="sensor_graph" data-info="temp" id="sensor-graph-temp-' +
    id +
    '">' +
    '<div class="graph_unit">&deg;C</div>' +
    '<div id="greenhouse' +
    id +
    '_tempGraph" class="graph_container"></div>' +
    '</div>' +
    '</div>' +
    '<div class="sensor_holder hum_holder">' +
    '<div class="hum_info_holder">' +
    '<div class="sensor_header">Air humidity<span>%</span></div>' +
    '<div id="sensor:greenhouse' +
    id +
    '/env/hum" class="sensor_info" data-min="0" data-max="100">' +
    '<div class="sensor_value" data-value="0"></div>' +
    '</div>' +
    '</div>' +
    '<div class="sensor_graph" data-info="hum" id="sensor-graph-hum-' +
    id +
    '">' +
    '<div class="graph_unit">%</div>' +
    '<div id="greenhouse' +
    id +
    '_humGraph" class="graph_container"></div>' +
    '</div>' +
    '</div>' +
    '<div class="sensor_holder soil_holder">' +
    '<div class="soil_info_holder">' +
    '<div class="sensor_header">Soil moisture<span>mm</span></div>' +
    '<div id="sensor:greenhouse' +
    id +
    '/env/soilm" class="sensor_info" data-min="65" data-max="125">' +
    '<div class="sensor_value" data-value="0"></div>' +
    '</div>' +
    '</div>' +
    '<div class="sensor_graph" data-info="soil" id="sensor-graph-soil-' +
    id +
    '">' +
    '<div class="graph_unit">mm</div>' +
    '<div id="greenhouse' +
    id +
    '_soilGraph" class="graph_container"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  $('.farms_holder').append(newFarm);
  $('.page_content.nano').nanoScroller();
  $('#greenhouse' + id + ' .waterswitcher input').click(function(event) {
    sendWateringAction(event, id);
  });
  $('#greenhouse' + id + ' .lightswitcher label').click(function(event) {
    sendLampAction(event, id);
  });
  myChart['greenhouse' + id] = [];
  var chart_click = function() {
    let g_id = $(this).attr('greenhouse-id');
    let ch_id = $(this).attr('data-info');
    let c = myChart[g_id][ch_id];
    if ($(this).hasClass('fullScreenMode')) {
      c.options.scales.xAxes[0].time.displayFormats.hour = 'H:mm';
      c.options.scales.xAxes[0].ticks.maxTicksLimit = 3;
    } else {
      c.options.scales.xAxes[0].time.displayFormats.hour = 'MMMM D, H:mm';
      c.options.scales.xAxes[0].ticks.maxTicksLimit = 5;
      c.options.scales.yAxes[0].ticks.userCallback = null;
    }
    $(this).toggleClass('fullScreenMode');
    $(this)
      .find('.graph_container')
      .toggleClass('fullScreenMode');
    c.update();
  };
  var ctx = 'greenhouse' + id + '_tempGraph';
  var cfg = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temp',
          data: [],
          fill: 'start',
          pointRadius: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)'
        }
      ]
    },
    options: get_chart_options()
  };
  cfg.options.scales.yAxes[0].ticks.min = 0;
  cfg.options.scales.yAxes[0].ticks.max = 50;
  myChart['greenhouse' + id]['temp'] = $eva.toolbox.chart(
    ctx,
    cfg,
    'sensor:greenhouse' + id + '/env/temp',
    {update: 60, fill: '10T:1', units: '°C'}
  );
  myChart['greenhouse' + id]['temp'].update();
  $('#sensor-graph-temp-' + id).attr('greenhouse-id', 'greenhouse' + id);
  $('#sensor-graph-temp-' + id).on('click', chart_click);

  ctx = 'greenhouse' + id + '_humGraph';
  var cfg = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Hum',
          data: [],
          fill: 'start',
          pointRadius: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)'
        }
      ]
    },
    options: get_chart_options()
  };
  cfg.options.scales.yAxes[0].ticks.min = 0;
  cfg.options.scales.yAxes[0].ticks.max = 100;
  myChart['greenhouse' + id]['hum'] = $eva.toolbox.chart(
    ctx,
    cfg,
    'sensor:greenhouse' + id + '/env/hum',
    {update: 60, fill: '10T:1', units: '%'}
  );
  myChart['greenhouse' + id]['hum'].update();
  $('#sensor-graph-hum-' + id).attr('greenhouse-id', 'greenhouse' + id);
  $('#sensor-graph-hum-' + id).on('click', chart_click);

  ctx = 'greenhouse' + id + '_soilGraph';
  var cfg = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Soil m.',
          data: [],
          fill: 'start',
          pointRadius: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)'
        }
      ]
    },
    options: get_chart_options()
  };
  cfg.options.scales.yAxes[0].ticks.min = 60;
  cfg.options.scales.yAxes[0].ticks.max = 130;
  myChart['greenhouse' + id]['soil'] = $eva.toolbox.chart(
    ctx,
    cfg,
    'sensor:greenhouse' + id + '/env/soilm',
    {update: 60, fill: '10T:1', units: ' mm'}
  );
  myChart['greenhouse' + id]['soil'].update();
  $('#sensor-graph-soil-' + id).attr('greenhouse-id', 'greenhouse' + id);
  $('#sensor-graph-soil-' + id).on('click', chart_click);
}

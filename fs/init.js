load('api_timer.js');
load('api_config.js');
load('api_httplib.js');
load('api_sys.js');
load('api_bme280.js');

let myBME = BME280.createI2C(0x76);
let myBMEData = BME280Data.create();

function timer_handler() {
    print('mJS.httlib Example/ Sys.uptime:', Sys.uptime());

    let url = Cfg.get('api_url'); //get URL from config

    let req = HTTPReq.create(url, HTTPLib.MT_POST, HTTPLib.CT_JSON);

    myBME.readAll(myBMEData);

    print('temperature, humid=', myBMEData.temp(), myBMEData.humid());
    req.setBody(JSON.stringify({ values: [myBMEData.temp(), myBMEData.humid()] }));
    req.addHeader('X-Imprement', 'mJS');

    let res = HTTPLib.send(req);

    if (res.isSuccess()) {
        print('Status', res.getStatus());
        //ヘッダ値取得
        let val = res.getHeaderVal('content-type');
        print('content-type=' + val);

        //レスポンスにあるデフォルトバッファを使わないでメモリ確保して値取得する例
        let val2buff = Sys.malloc(64);
        let val2 = res.getHeaderValWithBuff('date', val2buff);
        print('Date=' + val2);
        Sys.free(val2buff);

        // body
        let body = res.getBody();
        print('body:', body);
        // json属性
        let rjson = JSON.parse(body);
        print('JSON attr["success"]:', rjson['success']);
    } else {
        print('HTTP Request Error:', res.getStatus());
        // body
        let body = res.getBody();
        print('body:', body);
    }
    res.free();
}

Timer.set(180 * 1000, true, timer_handler, null);

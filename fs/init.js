load('api_timer.js');
load('api_config.js');
load('api_httplib.js');
load('api_sys.js');

function timer_handler() {
    print('mJS.httlib Example/ Sys.uptime:', Sys.uptime());

    let url = Cfg.get('api_url'); //get URL from config

    let req = HTTPReq.create(url, HTTPLib.MT_POST, HTTPLib.CT_JSON);

    req.setBody(JSON.stringify({ values: [Sys.uptime(), Sys.free_ram()] }));
    req.addHeader('X-Imprement', 'mJS');

    let res = HTTPLib.send(req);

    if (res.isSuccess()) {
        print('Status', res.getStatus());
        //ヘッダ値取得
        let val = res.getHeaderValWithBuff('content-type');
        let val2 = res.getHeaderValWithBuff('date');
        print('content-type=' + val);
        print('date=' + val2);

        // body
        let body = res.getBody();
        print('body:', body);
        // json属性
        let rjson = JSON.parse(body);
        print('JSON attr["success"]:', rjson['success']);
    } else {
        print('HTTP Request Error:', res.getStatus());
    }
    res.free();
}

Timer.set(10000, true, timer_handler, null);

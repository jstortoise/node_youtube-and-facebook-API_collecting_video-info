var http = require("http");
var ypi = require('youtube-playlist-info');
var FB = require('facebook-node');


var playlist = ["PLFtKQktEwYHswGgS8qWplQUGQyTajs06D", "PLFtKQktEwYHuANM-F3WHWahoIGhjqxoqF", "PLFtKQktEwYHvTeLPSdogHFcoFghOWE7G3", "PLFtKQktEwYHsX7CjicpMfVqnhzcbz5cNK",
    "PLFtKQktEwYHtTc98uXCcRwtXM3sl3hAFQ", "LLwHtb-E73AkUaeBb1-QJ0Qg", "PLFtKQktEwYHucXibEqcqJOkEgw-7OOxc_", "PLFtKQktEwYHtdNpaBn3X87d-XTMbkaV4f",
    "PLFtKQktEwYHtbUBlSB4QUX8ru0VpX85gF", "FLwHtb-E73AkUaeBb1-QJ0Qg", "PLFtKQktEwYHuNIXJOfePJouuwayHGs6xB", "PLFtKQktEwYHst_m-JPv6b78_V4-CZJMN8",
    "PLFtKQktEwYHsjUUBW3ZDPmT8POShd8KDY", "PLFtKQktEwYHtJlMcwOVMqJM-2qY_WAq0Q", "PLFtKQktEwYHvZV6G_Y5uOhOkRwfxkHc2O", "PLFtKQktEwYHsK-vKtXinqHVoP3VXOAH5g",
    "PLFtKQktEwYHt0UKB3ca86Ve8ZkT1ejqWI", "PLFtKQktEwYHvOy_745x9FCGCyWlZm26Lj", "PLFtKQktEwYHuM_6kkTnWn1ey3CehwmcPz", "PLFtKQktEwYHtNKIMbLxS1awff25gXuGDH",
    "PLD9050E21EA97EABA"
];

/*ypi.playlistInfo("AIzaSyC487xoTZzAiImK87vnsAomdIoyLFD0qk4", playlist[0], function(playlistItems) {
    console.log(playlistItems.length);
});*/


// for(i = 0; i < playlist.length; i++)
// {
//     ypi.playlistInfo("AIzaSyC487xoTZzAiImK87vnsAomdIoyLFD0qk4", playlist[i], function(playlistItems) {

//         var youtube_arr = [];
//         var index = 0;
//         for(j = 0 ; j< playlistItems.length ; j++)
//         {
//             var obj = {
//                 "id" : index,
//                 "name" : playlistItems[j].title,
//                 "content":"",
//                 "image" : playlistItems[j].thumbnails.default.url
//             };
//             index++;
//             youtube_arr.push(obj);
//         }
//         console.log(JSON.stringify(youtube_arr, null, 2));
//     });

// }
var youtube_all = [];
var id = 0;

function get_playlist_by_index(list_id, callback) {
    ypi.playlistInfo("AIzaSyC487xoTZzAiImK87vnsAomdIoyLFD0qk4", list_id, function(playlistItems) {

        var youtube_arr = [];

        for (j = 0; j < playlistItems.length; j++) {
            var obj = {
                "id": id,
                "name": playlistItems[j].title,
                "content": "",
                //"image" : (playlistItems[j].thumbnails.default ? playlistItems[j].thumbnails.default.url : "")
            };
            id++;
            youtube_arr.push(obj);
        }
        callback(youtube_arr);
    });
}

function getAll(i, callback) {
    if (i == playlist.length)
        callback();
    else if (i < playlist.length) {
        get_playlist_by_index(playlist[i], function(arr) {
            youtube_all = youtube_all.concat(arr);
            getAll(i + 1, callback);
        });
    }
}


var server = http.createServer(function(request, response) {

    getAll(0, function() {
        // console.log(youtube_all);

        var accessToken;
        FB.api('oauth/access_token', {
            client_id: '258970057917667',
            client_secret: '281bc93a15c883ab2d3750bbd846fd51',
            grant_type: 'client_credentials'
        }, function(res) {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write(JSON.stringify(youtube_all, null, 2));

            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            accessToken = res.access_token;
            FB.setAccessToken(accessToken);
            FB.api('/55713447392/videos?limit=99999', { access_token: accessToken }, function(res) {
                response.write(JSON.stringify(res, null, 2));
                response.end();
            });

        });
    });
});

server.listen(8888);
console.log("Server is listening");


// tgsssi2017  Facebook developer
// 		  app id: 127419694510960
// 		  App secret :92d49b73077869c8cc05b56ab6bc2fa1
//        474106865943

// 		  Test app id:258970057917667
// 		  App secret : 281bc93a15c883ab2d3750bbd846fd51

// tgsssi2017 google developer
// 		  API key: AIzaSyC487xoTZzAiImK87vnsAomdIoyLFD0qk4
// // //console.log(FB);
// var accessToken;

// FB.api('oauth/access_token', {
//     client_id: '258970057917667',
//     client_secret: '281bc93a15c883ab2d3750bbd846fd51',
//     grant_type: 'client_credentials'
// }, function (res) {
//     if(!res || res.error) {
//         console.log(!res ? 'error occurred' : res.error);
//         return;
//     }
//     accessToken = res.access_token;
//     //console.log(accessToken);

//     FB.setAccessToken(accessToken);

//     //var str = FB.getAccessToken();
//     //console.log(str);

//     FB.api('/55713447392/videos?limit=99999', {access_token: accessToken }, function (res) {
//         console.log(JSON.stringify(res,null,2));
//     });
// });
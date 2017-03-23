var Routers = Backbone.Router.extend({
// Hash maps for routes
routes : {
"" : "index",
"livescheduler/teams" : "getTeams",
"livescheduler/teams/:country" : "getTeamsCountry",
"livescheduler/teams/:country/:name" : "getTeam",
'blog(/:id)' : 'blog', // #blog（または#blog/123など）でのアクセス
"*error" : "fourOfour"
},

index: function(){
// Homepage 
},

getTeams: function() {
// List all teams 
},
getTeamsCountry: function(country) {
// Get list of teams for specific country
},
getTeam: function(country, name) {
// Get the teams for a specific country and with a specific name
}, 
fourOfour: function(error) {
// 404 page
    alert("想定外のページ遷移");
}
});

// DOMの生成が完了してからstart()
$(function(){
    var router = new Routers();
    Backbone.history.start({pushState : true, root: '/livescheduler/'});
    // ブラウザのhashChangeの監視を開始する
    // root アプリケーションのルートがドメイン直下ではない場合に指定
})
/*
View側でページ遷移させるときには
Backbone.history.navigate()または、Backbone.Routerのインスタンスのnavigate()

Backbone.history.navigate('blog/10', true);
第二引数にtrueを渡すと遷移が実行されますが、falseを渡すとハッシュ（URL）だけが変わる
*/
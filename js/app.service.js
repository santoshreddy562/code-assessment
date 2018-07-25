//https://itunes.apple.com/us/rss/toppaidapplications/limit=100/json

app.service("AppService", AppService);
AppService.$inject = ["$http"];

function AppService($http) {
    this.getApplications = function() {
        return $http.get("https://itunes.apple.com/us/rss/toppaidapplications/limit=100/json");
    }
}
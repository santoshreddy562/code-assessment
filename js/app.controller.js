app.controller("AppCtrl", AppCtrl);
AppCtrl.$inject= ["AppService"];
function AppCtrl(AppService){
    var vm = this;
    vm.sortBy = "desc-date";
    vm.applications = [];
    vm.pieData = [];
    vm.getApplications = function() {
        AppService.getApplications()
            .then(function(successResponse) {
                vm.applications = successResponse.data.feed.entry;
                vm.sortApplications();
                let data = vm.groupByPrice();
                Object.keys(data).forEach( function(key){
                    vm.pieData.push([key,data[key].length]);
                });   
                vm.drawChart();
            }, function(errorResponse){
                vm.applications = [];
            });
    }

    vm.groupByPrice = function() {
        let key = "im:price"
        return vm.applications.reduce(function(acc, cur) {
          (acc[cur[key].label] = acc[cur[key].label] || []).push(cur);
          return acc;
        }, {});
      };

    vm.sortApplications = function() {
        let sortType = vm.sortBy.split("-")[0];
        let sortProp = vm.sortBy.split("-")[1];
        if(sortType === "asc"){
            if(sortProp === "date") {
                vm.applications.sort(function(app1,app2){
                    let t1 = new Date(app1["im:releaseDate"].label).getTime();
                    let t2 = new Date(app2["im:releaseDate"].label).getTime();
                    return t2 - t1;
                });
            }else if(sortProp === "name") {
                vm.applications.sort(function(app1,app2){
                    let n1 = app1["im:name"].label;
                    let n2 = app2["im:name"].label;
                    return n1 < n2 ? -1: 1;
                });
            }else if(sortProp === "price") {
                vm.applications.sort(function(app1,app2){
                    let p1 = parseFloat(app1["im:price"].label.replace("$", ""));
                    let p2 = parseFloat(app2["im:price"].label.replace("$", ""));
                    return p1 - p2;
                });
            }
        }else {
            if(sortProp === "date") {
                vm.applications.sort(function(app1,app2){
                    let t1 = new Date(app1["im:releaseDate"].label).getTime();
                    let t2 = new Date(app2["im:releaseDate"].label).getTime();
                    return t1 - t2;
                });
            }else if(sortProp === "name") {
                vm.applications.sort(function(app1,app2){
                    let n1 = app1["im:name"].label;
                    let n2 = app2["im:name"].label;
                    return n2 < n1 ? -1: 1;
                });
            }else if(sortProp === "price") {
                vm.applications.sort(function(app1,app2) {
                    let p1 = parseFloat(app1["im:price"].label.replace("$", ""));
                    let p2 = parseFloat(app2["im:price"].label.replace("$", ""));
                    return p2 - p1;
                });
            }
        }
    }

    vm.drawChart = function(){
        var chart = c3.generate({
            bindto:"#app_pie_chart",
            data: {
                columns:vm.pieData,
                type : 'pie'
            },
            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },
            title: { text: "iTunes Top Paid Applications"}
        });
    }

    vm.getApplications();
}
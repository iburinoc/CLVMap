var data = [];

var init = function() {
        console.log('initializing map');
        $("#info").hide();
        moved = function(e) {
                var imwidth = $("#map").width();
                var imheight = $("#map").height();
                var x = e.offsetX / imwidth;
                var y = e.offsetY / imheight;
                var closeI = -1;
                var closeD = 0.001;
                for(var i = 1; i <= 100; i++) {
                        if(data[i].x && data[i].y) {
                                var d = (x - data[i].x)*(x - data[i].x) + (y - data[i].y)*(y - data[i].y);
                                if(d < closeD) {
                                        closeI = i;
                                        closeD = d;
                                }
                        }
                }

                if(closeI == -1) {
                        $("#info").hide();
                } else {
                        $("#info-head").text('Unit ' + closeI);
                        if(data[closeI].people) {
                                $("#info-bod").html(data[closeI].people.join('<br>'));
                        } else {
                                $("#info-bod").html("???");
                        }
                        var imgoff = $("#image").offset();
                        $("#info").offset({ top: e.offsetY + imgoff.top, left: e.offsetX + imgoff.left });
                        $("#info").show();
                }
        }
        $("#image").mousemove(moved);
        $("#image").click(moved /*function(e) {
                var imwidth = $("#map").width();
                var imheight = $("#map").height();
                var x = e.offsetX / imwidth;
                var y = e.offsetY / imheight;
                $("#points").html($("#points").html() + x + "<br>" + y + "<br>");

        }*/);

        for(var i = 0; i <= 100; i++) {
                data.push({});
        }

        $.ajax({
                url: "points.txt",
                success: function(d) {
                        d = d.split('\n');
                        for(var i = 1; i <= 100; i++) {
                                data[i].x = Number(d[i * 2 - 2]);
                                data[i].y = Number(d[i * 2 - 1]);
                        }
                        console.log(data);
                }
        });
        $.ajax({
                url: "people.txt",
                success: function(d) {
                        d = d.split('\n');
                        for(var i = 1; i <= 100; i++) {
                                data[i].people = [];
                                for(var j = 0; j < 4; j++) {
                                        data[i].people.push(d[i * 5 - 4 + j].replace(/-\s?/, ""));
                                }
                                if(!data[i].people[0]) {
                                        data[i].people = undefined;
                                }
                        }
                        console.log(data);
                }
        })
}

$(document).ready(init);

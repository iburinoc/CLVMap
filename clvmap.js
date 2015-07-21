var data = [];

function inside(xp, yp, x, y) {
        for(var i = 0; i < xp.length; i++) {
                var dx1 = xp[i] - x;
                var dy1 = yp[i] - y;
                var dx2 = xp[(i + 1) % xp.length] - x;
                var dy2 = yp[(i + 1) % xp.length] - y;

                if(dx1 * dy2 - dx2 * dy1 < 0) {
                        return false;
                }
        }
        return true;
}

var init = function() {
        console.log('initializing map');
        $("#info").hide();
        moved = function(e) {
                var imwidth = $("#map").width();
                var imheight = $("#map").height();
                var off = $("#map").offset();
                var x = (e.pageX - off.left) / imwidth;
                var y = (e.pageY - off.top) / imheight;
                var idx = -1;
                for(var i = 1; i <= 100; i++) {
                        if(data[i].x && data[i].y) {
                                if(inside(data[i].x, data[i].y, x, y)) {
                                        idx = i;
                                        break;
                                }
                        }
                }

                if(idx == -1) {
                        $("#info").hide();
                } else {
                        $("#info-head").text('Unit ' + idx);
                        if(data[idx].people) {
                                $("#info-bod").html(data[idx].people.join('<br>'));
                        } else {
                                $("#info-bod").html("???");
                        }
                        var imgoff = $("#image").offset();
                        var infow = $("#info").width();
                        var infoh = $("#info").height();
                        $("#info").offset({ top: y * imheight + imgoff.top + 10, left: x * imwidth + imgoff.left - infoh / 2 });
                        $("#info").show();
                }
        }
        $("#image").mousemove(moved);
        $("#image").click(function(e) {
                var imwidth = $("#map").width();
                var imheight = $("#map").height();
                var x = e.offsetX / imwidth;
                var y = e.offsetY / imheight;
                $("#points").html($("#points").html() + x + "<br>" + y + "<br>");

        });

        for(var i = 0; i <= 100; i++) {
                data.push({});
        }

        $.ajax({
                url: "points.txt",
                success: function(d) {
                        d = d.split('\n');
                        for(var i = 1; i <= 100; i++) {
                                data[i].x = [];
                                data[i].y = [];
                                for(var j = 0; j < 4; j++) {
                                        data[i].x.push(Number(d[i * 8 - 8 + j * 2]));
                                        data[i].y.push(Number(d[i * 8 - 7 + j * 2]));
                                }
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

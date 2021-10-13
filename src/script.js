$(function () {

    var map = L.map('game');
    map.fitBounds([
        [40.7846554, 34.9790105],
        [10.5713638, 60.5905119]
    ]);

    var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    });
    const icon_size = [40, 40]
    const jerusalem_icon = L.icon({
        iconUrl: 'src/dome.png',
        iconSize: icon_size,
        iconAnchor: [0, 15],
    });

    const mecca_icon = L.icon({
        iconUrl: 'src/kaaba.png',
        iconSize: icon_size,
        iconAnchor: [-15, 15],
    });

    const medina_icon = L.icon({
        iconUrl: 'src/medina_mosque.png',
        iconSize: icon_size,
        iconAnchor: [-0, 15],
    });


    const jerusalem = L.marker([31.7964453, 35.1053192], {
        icon: jerusalem_icon

    }).bindTooltip("Jerusalem", {
        offset: [50, 8]
    });

    jerusalem.bindPopup("Jerusalem is the third most important city to Islam. It's importance comes from the fact the it is related to prophets mentioned in the Quaran, such as Abraham, David, Solomon, and Jesus.", {
        offset: [20, -15]
    }).openPopup();

    const mecca = L.marker([21.4362767, 39.7064625], {
        icon: mecca_icon

    }).bindTooltip("Mecca", {
        offset: [65, 4]
    });

    mecca.bindPopup("Mecca is considered the most important city of Islam. It is where the prophet Muhammed lived and is where the Ka'aba is.", {
        offset: [35, -15]
    }).openPopup();

    const medina = L.marker([24.5175721, 39.5579209], {
        icon: medina_icon
    }).bindTooltip("Medina", {
        offset: [50, 8]
    });

    medina.bindPopup("Medina is considered the second most important city to Islam. It is where the prophet Muhammed's tomb lies and is where Islam started.", {
        offset: [20, -15]
    }).openPopup();


    Stamen_Watercolor.addTo(map);
    jerusalem.addTo(map);
    mecca.addTo(map);
    medina.addTo(map);
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    const questions = [
        ["Who believed Ali should be in control of Islam?", "shia", "standard"],
        ["Who believes the leader of Islam should be chosen, not inherited?", "sunni", "standard"],
        ["Who makes up only 10% of all Muslims?", "shia", "standard"],
        ["Who believes Allah is the one true god?", "both", "standard"],
        ["Who believes that the Quran recalls the last revelations from Allah?", "both", "standard"],
        ["Who believes in multiple gods?", "neither", "standard"],
        ["BONUS: Which sect of Islam is the most common in Jerusalem?", "sunni", "bonus"],
        ["Which means \"one who follows tradition?\"", "sunni", "standard"],
        ["Who makes up around 90% of all Muslims?", "sunni", "standard"],
        ["Who believes that Allah's son is the prophet Muhammed?", "neither", "standard"],
        ["BONUS: Which sect of Islam is most prominent in Iran?", "shia", "bonus"],
        ["Who believes in Imams?", "shia", "standard"],
        ["Who belive that Abraham, Moses, Jesus, and Muhammad were all prophets or messengers of God?", "both", "standard"],

    ];

    $(".leaflet-control-zoom").css("visibility", "hidden");

    questions.sort(() => .5 - Math.random());
    questions.unshift(["Who follows the five pillars of faith?", "both", "standard"])
    console.log(`${questions.length} total questions`)
    const timeout = async ms => new Promise(res => setTimeout(res, ms));
    let next = false; // this is to be changed on user input
    let user_answer = "";
    const correct_answers = [];
    for(var i = 0;i < questions.length-1; i ++){
        correct_answers.push("");
    }
    


    async function waitUserInput() {
        while (next === false) {
            console.log("waiting for input...");
            await timeout(50);
        } // pause script but avoid browser to freeze ;)
        next = false; // reset var

    }


    async function run(map, questions, recurse, quiz_length = null, q_num = 0, old_marker = null) {
        console.log(correct_answers)    
        if (old_marker) {
            map.removeLayer(old_marker)
        }

        if (recurse == 0) {
            alert(`Thanks for playing! You scored a ${Math.round((correct_answers.reduce((a, b) => a + b, 0)/quiz_length) * 100)}%!`)
            
            return;
        }
        if (quiz_length === null) {

            quiz_length = questions.length;
        }
        /*
        code help at = "https://stackoverflow.com/questions/51013412/how-to-do-javascript-await-on-user-input-in-an-async-function"
        BUG WHERE POINTER WILL DUPLICATE @ Q 9 
        */


        const startPos = [31.5, 35],
            endPos = [21, 40],
            xDiff = endPos[0] - startPos[0],
            yDiff = endPos[1] - startPos[1],
            currX = (q_num * xDiff / quiz_length) + startPos[0],
            currY = (q_num * yDiff / quiz_length) + startPos[1],
            player_icon = L.icon({
                iconUrl: 'src/player.png',
                iconSize: [30, 30],
                iconAnchor: [-15, 15],
            });
        let location = [currX, currY]

        const player = L.marker(location).bindTooltip("You are here");

        player.addTo(map);
        $('#q-field').text((q_num + 1) + ". " + questions[0][0]); //change text
        await waitUserInput();

        console.log("answered with", user_answer);
        if (user_answer == questions[0][1]) {
            if (questions[0][2] === "bonus") {

                $('#point-counter').text(+($('#point-counter').text()) + 20);
            }
            //correct
            if(correct_answers[q_num] === "") {
                correct_answers[q_num] = 1
            }
            console.log(user_answer, "is correct");

            $('#point-counter').text(+($('#point-counter').text()) + 10);
            $('#' + user_answer).css('background-color', 'green');
            setTimeout(function () {
                $('#' + user_answer).css('background-color', 'white');
            }, 250);
            questions.shift();
            run(map, questions, questions.length, quiz_length, q_num + 1, player);

        } else {
             if (correct_answers[q_num] === "") {
                 correct_answers[q_num] = 0
             }
            //answer was inncorrect
            $('#' + user_answer).css('background-color', 'red');
            setTimeout(function () {
                $('#' + user_answer).css('background-color', 'white');
            }, 150);
            if (questions[0][2] === "standard") {
                if ($('#point-counter').text() > 1) {
                    $('#point-counter').text(+($('#point-counter').text()) - 2);
                }

            } else { //(if the question was a bonus)
                questions.shift();
                q_num++;
            }
           
            console.log(user_answer, "is incorrect");
            run(map, questions, questions.length, quiz_length, q_num, player);
        }




    }
    $('.answer').click(function () { // If an answer was clicked
        next = true;
        user_answer = $(this).attr('id');
    });

    run(map, questions, questions.length);
});
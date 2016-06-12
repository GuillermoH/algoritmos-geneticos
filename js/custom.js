/**
 * Created by HellmundPC on 6/11/2016.
 */

var genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Minimize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

genetic.seed = function() {

    var vector = [];
    var pastelP = 0;
    var pastelQ = 0;

    while( (3*pastelP + 6*pastelQ) > 150 && ( pastelP + 0.5*pastelQ ) > 22 && ( pastelP + pastelQ ) > 27.5 ) {

        pastelP = Math.floor((Math.random() * 1) * 100);
        pastelQ = Math.floor((Math.random() * 1) * 100);
    }

    // we add the elements to the genepool
    vector.push(pastelP);
    vector.push(pastelQ);

    return vector;
};

genetic.mutate = function(entity) {

    var drift = Math.floor((Math.random()-0.5)*3);
    var i = Math.floor(Math.random()*entity.length);
    entity[i] += drift;

    return entity;
};

genetic.notification = function(pop, generation, stats, isFinished) {

    function lerp(a, b, p) {
        return a + (b-a)*p;
    }

    var value = pop[0].entity;
    this.last = this.last||value;

    if (pop != 0 && value == this.last)
        return;

    var solution = [];

    solution.push("<span > Pastel P: </span>"+"<span >" + value[0] + "</span>"+"<span > Pastel Q: </span>"+"<span >" + value[1] + "</span>");

    var buf = "<tr>" + "<td>" + generation + "</td>" + "<td>" + pop[0].fitness.toPrecision(3) + "</td>" + "<td>" + solution.join("") + "</td>" + "</tr>";
    $("#results tbody").prepend(buf);

    if (isFinished) {
        var res = 20 * pop[0].entity[0] + 30 * pop[0].entity[1];
        var vala = pop[0].entity[0];
        var valb = pop[0].entity[1];
        var buf = "<h5> Solución optima:  " + vala + " docenas de pasteles del tipo P y " + valb + " docenas de pasteles del tipo Q acumulando " + res + " Bs.F"+"</h5>";
        $("#fin").prepend(buf);
    }
    this.last = value;
};


genetic.crossover = function(mother, father) {

    function lerp(a, b, p) {
        return a + Math.floor((b-a)*p);
    }

    var len = mother.length;
    var i = Math.floor(Math.random()*len);
    var r = Math.random();
    var son = [].concat(father);
    var daughter = [].concat(mother);

    son[i] = lerp(father[i], mother[i], r);
    daughter[i] = lerp(mother[i], father[i], r);

    return [son, daughter];
};

genetic.fitness = function(entity) {

    var fitness = 0;
    var a = entity[0];
    var b = entity[1];

    fitness = Math.sqrt(Math.pow((5 - a), 2) + Math.pow((22 - b), 2) + 1);

    return fitness;
};

genetic.generation = function(pop, generation, stats) {
    if (pop[0].entity[0] == 5 && pop[0].entity[1] == 22) {
        return 0;
    }
};




$(document).ready(function () {

    $("#solve").click(function () {

        $("#results tbody").html("");
        $("#fin").html("");
        var config = {
            "iterations": $("#iterations").val()
            , "size": 250
            , "crossover": parseFloat($("#crossover").val())
            , "mutation": parseFloat($("#mutation").val())
            , "skip": 5
        };

        var userData = {
        };

        genetic.evolve(config, userData);
    });

    $("#single-selection").change(function () {
        genetic.select1 = eval($(this).val());
    });

    $("#pair-selection").change(function () {
        genetic.select2 = eval($(this).val());
    });
});
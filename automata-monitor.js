var lifespanTimelineTable = undefined;
var lifespanAutomataTimeline = {};

function addGraph(name) {
    if (document.getElementById(name) !== undefined) {
        var parent = document.createElement("div");
        var title = document.createElement("h2");
        title.innerText = name;
        title.style.fontFamily = "Roboto";
        parent.appendChild(title);
        var div = document.createElement("div");
        div.style.height = '256px';
        div.style.width = '1200px';
        div.style.minWidth = '1200px';
        div.style.maxWidth = '1200px';
        div.id = name;
        parent.appendChild(div);
        document.getElementById('lifespanAutomataTimeline').appendChild(parent);
    }
}

function paintGraph(name) {
    var chartLifespan = new google.visualization.AnnotationChart(document.getElementById(name));

    var options = {
        displayAnnotations: false,
    };

    chartLifespan.draw(lifespanAutomataTimeline[name], options);
}

function monitor(lifespanElementId, lifespanTimelineId, graphElementId) {
    google.charts.load("current", { packages: ["timeline", 'annotationchart'] });
    var drawChart = function () {
        if (lifespanTimelineTable === undefined) {
            lifespanTimelineTable = new google.visualization.DataTable();
            lifespanTimelineTable.addColumn('date', 'Timestamp');
            Automata.spawned().forEach(function (_automata) {
                lifespanTimelineTable.addColumn('number', _automata._name);
                //lifespanTimelineTable.addColumn('string', 'Life Status');
            });
        }
        var container = document.getElementById(lifespanElementId);
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        var lifespanRow = [new Date(Date.now())];

        dataTable.addColumn({ type: 'string', id: 'Term' });
        dataTable.addColumn({ type: 'string', id: 'Name' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });

        Automata.Energy.Producer.spawned().forEach(function (_producer) {
            dataTable.addRows([['Producer', _producer._name, new Date(_producer.getBegin()), new Date(_producer.getEnd())]]);
            //lifespanRow.push(_producer._energyStore);
            //lifespanRow.push((_producer.running) ? 'Alive' : 'Dead');
            if (lifespanAutomataTimeline[_producer._name] === undefined) {
                lifespanAutomataTimeline[_producer._name] = new google.visualization.DataTable();
                lifespanAutomataTimeline[_producer._name].addColumn("date", "Timestamp");
                lifespanAutomataTimeline[_producer._name].addColumn("number", "Energy Store");
                lifespanAutomataTimeline[_producer._name].addColumn("number", "Consumption");
                lifespanAutomataTimeline[_producer._name].addColumn("number", "Production");
                addGraph(_producer._name);
            }
            lifespanAutomataTimeline[_producer._name].addRows([[lifespanRow[0], _producer._energyStore, _producer._consumption, _producer._production]]);
        });
        Automata.Energy.Consumer.spawned().forEach(function (_consumer) {
            dataTable.addRows([['Consumer', _consumer._name, new Date(_consumer.getBegin()), new Date(_consumer.getEnd())]]);
            //lifespanRow.push(_consumer._energyStore);
            //lifespanRow.push((_consumer.running) ? 'Alive' : 'Dead');
            if (lifespanAutomataTimeline[_consumer._name] === undefined) {
                lifespanAutomataTimeline[_consumer._name] = new google.visualization.DataTable();
                lifespanAutomataTimeline[_consumer._name].addColumn("date", "Timestamp");
                lifespanAutomataTimeline[_consumer._name].addColumn("number", "Energy Store");
                lifespanAutomataTimeline[_consumer._name].addColumn("number", "Consumption");
                addGraph(_consumer._name);
            }
            lifespanAutomataTimeline[_consumer._name].addRows([[lifespanRow[0], _consumer._energyStore, _consumer._consumption]]);
        });

        //lifespanTimelineTable.addRows([lifespanRow]);
        //var chartLifespan = new google.visualization.AnnotationChart(document.getElementById(lifespanTimelineId));
        //var options = {
        //    displayAnnotations: false
        //};
        //chartLifespan.draw(lifespanTimelineTable, options);

        chart.draw(dataTable, {
            timeline: {
                rowLabelStyle: { fontName: 'Roboto' },
                barLabelStyle: { fontName: 'Roboto' }
            }
        });

        var elements = [];
        Automata.spawned().forEach(function (_automata) {
            var _color = (_automata._type === Automata.CellType.EnergyProducer) ? '#e60000' : '#008ae6';
            elements.push({ group: 'nodes', data: { id: _automata._name, color: _color } });
            if (_automata._type === Automata.CellType.ReproductiveConsumer) {
                _automata._children.forEach(function (_child) {
                    elements.push({
                        group: 'edges',
                        data: {
                            id: 'child_edge_' + _automata._name + '_' + _child,
                            source: _automata._name,
                            target: _child,
                            color: '#eeee88',
                            lineStyle: 'dotted'
                        }
                    });
                });
            }
        });
        Automata.Energy.Producer.spawned().forEach(function (_producer) {
            _producer.connections.out.forEach(function (_connection) {
                elements.push({
                    group: 'edges',
                    data: {
                        id: 'edge_' + _producer._name + '_' + _connection._name,
                        source: _producer._name,
                        target: _connection._name,
                        color: (_connection.running) ? '#888888' : '#dddddd',
                        lineStyle: 'solid'
                    }
                });
            });
        });

        var automatonGraphObject = cytoscape({
            container: document.getElementById(graphElementId),
            elements: elements,

            layout: {
                name: 'cose-bilkent',
                animate: false
            },

            // so we can see the ids
            style: [
                {
                    selector: 'node',
                    style: {
                        'content': 'data(id)',
                        'background-color': 'data(color)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': 'data(color)',
                        'line-style': 'data(lineStyle)',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            directed: true
        });
    };

    var deathMonitor = Automata.Automaton(function () {
        var allDead = true, allConsumers = true;
        deathMonitor._life += 1;
        Automata.spawned().forEach(function (_automata) {
            allDead = allDead && !_automata.running;
            if (_automata._type.indexOf("Consumer") !== -1) {
                allConsumers = allConsumers && !_automata.running;
            }
        });
        if (allConsumers) {
            Automata.Energy.Producer.spawned().forEach(function (_producer) {
                _producer.stop();
            });
        }
        if (allDead) {
            deathMonitor._life = -1;
            Console.log("PLOTTING death");
        } else {
            Console.log("WAITING for eveything to DIE");
        }
        //Chart
        drawChart();
    }, 2000, function () {
        Console.log("FINISHING and Dying");
        drawChart();
        for (var key in lifespanAutomataTimeline) {
            paintGraph(key);
        }
    }, 1);

    google.charts.setOnLoadCallback(function () {
        deathMonitor.start();
    });
}
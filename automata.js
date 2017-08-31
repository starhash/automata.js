var $this = {};
var Automata = (function () {
    var $this = {};
    $this._spawnedAutomata = [];

    $this.spawn = function (_automata) {
        $this._spawnedAutomata.push(_automata);
    };

    $this.spawned = function () {
        return $this._spawnedAutomata;
    };
    $this.Automaton = function () {
        var $this = { $constructors: [] };
        $this.$constructors.push(function () {
            $this.running = false;
            $this._count = 0;
            $this._life = 0;
            Automata.spawn($this);
        });
        $this.$constructors.push(function (_run, _delta, _stop, _life) {
            $this.running = false;
            $this._run = _run;
            $this._delta = _delta;
            $this._stop = _stop;
            $this._count = 0;
            $this._life = _life;
        });

        $this.stop = function () {
            if ($this.running) {
                $this.running = false;
                $this._count = 0;
                $this._end = Date.now();
                $this._stop();
            }
        };

        $this.run = function () {
            if ($this.running && ($this._life > $this._count)) {
                $this._run();
                $this._count += 1;
                setTimeout(function () {
                    $this.run();
                }, $this._delta);
            } else {
                $this.stop();
            }
        };

        $this.start = function () {
            if ($this.running == false) {
                $this._begin = Date.now();
                $this.running = true;
                $this.run();
            }
        };

        var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
        $this.$constructors.forEach(function ($constructor) {
            if ($constructor.length === $arguments.length && !$constructed) {
                $constructor.apply($this, $arguments); $constructed = true;
            }
        });
        return $this;
    };

    $this.CellState = (function () {
        return {
            Unborn: "$enum:CellState/Unborn",
            Living: "$enum:CellState/Living",
            Dead: "$enum:CellState/Dead"
        };
    })();

    $this.CellType = (function () {
        return {
            None: "$enum:CellType/None",
            EnergyProducer: "$enum:CellType/EnergyProducer",
            EnergyConsumer: "$enum:CellType/EnergyConsumer",
            ReproductiveConsumer: "$enum:CellType/ReproductiveConsumer"
        };
    })();

    $this.Cell = function () {
        var $this = Automata.Automaton();
        $this.connections = {};
        $this.connectionStateActions = {};
        $this.state = Automata.CellState.Living;
        $this.$constructors.push(function () {
            $this.connections.in = [];
            $this.connections.inLimit = 0;
            $this.connections.out = [];
            $this.connections.outLimit = 0;
            $this._delta = 1000;
            $this._begin = -1;
            $this._end = 0;
            $this._type = Automata.CellType.None;
        });
        $this.$constructors.push(function (_life) {
            $this.connections.in = [];
            $this.connections.inLimit = 0;
            $this.connections.out = [];
            $this.connections.outLimit = 0;
            $this._delta = 1000;
            $this._life = _life;
            $this._begin = -1;
            $this._end = 0;
        });

        $this.getBegin = function () {
            if ($this._begin !== -1) {
                return $this._begin;
            }

            return 0;
        };

        $this.getEnd = function () {
            if ($this._end !== 0) {
                return $this._end;
            }

            return Date.now();
        };

        $this.addOutConnection = function (cell) {
            if ($this.connections.out.length < $this.connections.outLimit) {
                $this.connections.out.push(cell);
                if ($this._addOutConnection !== undefined) {
                    $this._addOutConnection(cell);
                }
            }
        };

        $this.addInConnection = function (cell) {
            if ($this.connections.in.length < $this.connections.inLimit) {
                $this.connections.in.push(cell);
                if ($this._addInConnection !== undefined) {
                    $this._addInConnection(cell);
                }
            }
        };

        $this._run = function () {
            Console.log("OK " + $this._count);
        };

        $this._stop = function () {
            Console.log("STOPPED");
        };

        var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
        $this.$constructors.forEach(function ($constructor) {
            if ($constructor.length === $arguments.length && !$constructed) {
                $constructor.apply($this, $arguments); $constructed = true;
            }
        });
        return $this;
    };

    return $this;
})();
$this.Automata = Automata;


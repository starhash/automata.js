var $this = {};
var Console = (function () {
var $this = {};
$this.log = {};

$this.log = function (message) { $this.log[Date.now]=message;
console.log (message);
};
return $this;
})();
$this.Console = Console;

var Automata = (function () {
var $this = {};
$this._spawnedAutomata = [  ];

$this.spawn = function (_automata) { $this._spawnedAutomata.push (_automata);
};

$this.spawned = function () { 
return $this._spawnedAutomata;
};
$this.Automaton = function () {
var $this = {$constructors: []};
$this.$constructors.push(function () {$this.running=false;
$this._count=0;
$this._life=0;
Automata.spawn ($this);
});
$this.$constructors.push(function (_run,_delta,_stop,_life) {$this.running=false;
$this._run=_run;
$this._delta=_delta;
$this._stop=_stop;
$this._count=0;
$this._life=_life;
});

$this.stop = function () { if ($this.running) {$this.running=false;
$this._count=0;
$this._end=Date.now ();
$this._stop ();
}
};

$this.run = function () { if ($this.running&&($this._life>$this._count)) {$this._run ();
$this._count+=1;
setTimeout (function (){$this.run ();
}, $this._delta);
} else {$this.stop ();
}
};

$this.start = function () { if ($this.running==false) {$this._begin=Date.now ();
$this.running=true;
$this.run ();
}
};

var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
                        $this.$constructors.forEach(function ($constructor) {
                            if ($constructor.length === $arguments.length && !$constructed) {
                                $constructor.apply($this, $arguments); $constructed = true;
                            }
                        });
return $this;};

$this.CellState = (function () {return {
Unborn : "$enum:CellState/Unborn",
Living : "$enum:CellState/Living",
Dead : "$enum:CellState/Dead"
}; })();

$this.CellType = (function () {return {
None : "$enum:CellType/None",
EnergyProducer : "$enum:CellType/EnergyProducer",
EnergyConsumer : "$enum:CellType/EnergyConsumer",
ReproductiveConsumer : "$enum:CellType/ReproductiveConsumer"
}; })();

$this.Cell = function () {
var $this = Automata.Automaton();
$this.connections = {};
$this.connectionStateActions = {};
$this.state = Automata.CellState.Living;
$this.$constructors.push(function () {$this.connections.in=[  ];
$this.connections.inLimit=0;
$this.connections.out=[  ];
$this.connections.outLimit=0;
$this._delta=1000;
$this._begin=-1;
$this._end=0;
$this._type=Automata.CellType.None;
});
$this.$constructors.push(function (_life) {$this.connections.in=[  ];
$this.connections.inLimit=0;
$this.connections.out=[  ];
$this.connections.outLimit=0;
$this._delta=1000;
$this._life=_life;
$this._begin=-1;
$this._end=0;
});

$this.getBegin = function () { if ($this._begin!==-1) {
return $this._begin;
}

return 0;
};

$this.getEnd = function () { if ($this._end!==0) {
return $this._end;
}

return Date.now ();
};

$this.addOutConnection = function (cell) { if ($this.connections.out.length<$this.connections.outLimit) {$this.connections.out.push (cell);
if ($this._addOutConnection!==undefined) {$this._addOutConnection (cell);
}
}
};

$this.addInConnection = function (cell) { if ($this.connections.in.length<$this.connections.inLimit) {$this.connections.in.push (cell);
if ($this._addInConnection!==undefined) {$this._addInConnection (cell);
}
}
};

$this._run = function () { Console.log ("OK "+$this._count);
};

$this._stop = function () { Console.log ("STOPPED");
};

var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
                        $this.$constructors.forEach(function ($constructor) {
                            if ($constructor.length === $arguments.length && !$constructed) {
                                $constructor.apply($this, $arguments); $constructed = true;
                            }
                        });
return $this;};

var Energy = (function () {
var $this = {};
$this.Producer = function () {
var $this = Automata.Cell();
$this.$constructors.push(function (name,cons,prod,growth) {$this._life=1;
$this._consumption=cons;
$this._production=prod;
$this._energyStore=cons;
$this._growth=growth;
$this._growthCPFactor=prod/cons;
$this.connections.outLimit=8;
$this.connections.inLimit=4;
$this._actions=[  ];
$this._name=name;
$this._type=Automata.CellType.EnergyProducer;
Automata.Energy.Producer.spawn ($this);
});

$this._onProduction = function () { Console.log ($this._name+" PRODUCE "+$this._production+", STORE "+$this._energyStore);
};

$this._onConsumption = function () { Console.log ($this._name+" CONSUMED "+$this._consumption);
};

$this.produce = function () { $this._energyStore+=$this._production;
$this._onProduction ();
$this._consumption+=$this._growth;
};

$this.consume = function () { $this._energyStore-=$this._consumption;
$this._onConsumption ();
$this._consumption+=$this._growth;
$this._growth=Math.sqrt (2*Math.pow ($this._growth, 2));
};

$this._addOutConnection = function (cell) { cell.addInConnection ($this);
cell.connectionStateActions[$this._actions0]=$this._transferAction;
};

$this._transferAction = function (cell, amount) { cell._energyStore+=amount;
$this._energyStore-=amount;
Console.log ($this._name+" TRANSFER "+amount);
};

$this._transfer = function () { $this.connections.out.forEach (function (cell){if ((cell.running) && ($this._energyStore>cell._consumption)) {cell.connectionStateActions[$this._actions0] (cell, cell._consumption);
}
});
Console.log ($this._name+" REMAIN "+$this._energyStore);
};

$this._stop = function () { Console.log ($this._name+" STOPPED");
$this.running=false;
$this._production=0;
$this._consumption=0;
$this._energyStore=0;
};

$this._run = function () { $this.consume ();
$this.produce ();
$this._transfer ();
};

$this.run = function () { if ($this._energyStore>=$this._consumption) {$this._run ();
setTimeout (function (){$this.run ();
}, $this._delta);
} else {$this.stop ();
}
};

var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
                        $this.$constructors.forEach(function ($constructor) {
                            if ($constructor.length === $arguments.length && !$constructed) {
                                $constructor.apply($this, $arguments); $constructed = true;
                            }
                        });
return $this;};


$this.Producer.spawned = function () { 
return $this.Producer._spawnedProducers;
};


$this.Producer.spawn = function (_producer) { $this.Producer._spawnedProducers.push (_producer);
};

$this.Producer._spawnedProducers = [  ];

$this.Consumer = function () {
var $this = Automata.Cell();
$this.$constructors.push(function () {$this._type=Automata.CellType.EnergyConsumer;
$this.connections.inLimit=4;
Automata.Energy.Consumer.spawn ($this);
});
$this.$constructors.push(function (name,cons,growth) {$this._consumption=cons;
$this._energyStore=cons;
$this._growth=growth;
$this._name=name;
$this._type=Automata.CellType.EnergyConsumer;
$this.connections.inLimit=4;
Automata.Energy.Consumer.spawn ($this);
});

$this._onConsumption = function () { Console.log ($this._name+" CONSUMED "+$this._consumption);
};

$this._consumerAction = function () { };

$this.consume = function () { $this._energyStore-=$this._consumption;
$this._onConsumption ();
$this._consumerAction ();
$this._consumption+=$this._growth;
$this._growth=Math.sqrt (1*Math.pow ($this._growth, 2));
};

$this._run = function () { $this.consume ();
$this._count+=1;
};

$this._stop = function () { Console.log ($this._name+" STOPPED");
$this.running=false;
$this._consumption=0;
$this._energyStore=0;
};

$this.run = function () { if ($this._energyStore>=$this._consumption) {$this._run ();
setTimeout (function (){$this.run ();
}, $this._delta);
} else {$this.stop ();
}
};

var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
                        $this.$constructors.forEach(function ($constructor) {
                            if ($constructor.length === $arguments.length && !$constructed) {
                                $constructor.apply($this, $arguments); $constructed = true;
                            }
                        });
return $this;};


$this.Consumer.spawned = function () { 
return $this.Consumer._spawnedConsumers;
};


$this.Consumer.spawn = function (_consumer) { $this.Consumer._spawnedConsumers.push (_consumer);
};

$this.Consumer._spawnedConsumers = [  ];

$this.ReproductiveConsumer = function () {
var $this = Automata.Energy.Consumer();
$this.$constructors.push(function (name,cons,growth,splitThreshold,splitFactor) {$this._splitThreshold=splitThreshold;
$this._splitFactor=splitFactor;
$this._consumption=cons;
$this._energyStore=cons;
$this._growth=growth;
$this._name=name;
$this._children=[  ];
$this._type=Automata.CellType.ReproductiveConsumer;
});

$this._produceRandomProducer = function (random, child) { var producer = Automata.Energy.Producer ($this._name+"_Prod"+$this._children.length, $this._consumption*random, $this._energyStore*(1-random), $this._growth*random);
producer.addOutConnection (child);
$this._children.push (producer._name);
producer.start ();
};

$this.split = function () { $this._consumption=$this._splitFactor*$this._consumption;
$this._production=$this._splitFactor*$this._production;
$this._energyStore=$this._splitFactor*$this._energyStore;
var child = Automata.Energy.ReproductiveConsumer ($this._name+"_"+$this._children.length, $this._consumption, $this._growth, $this._splitThreshold, $this._splitFactor);
$this.connections.in.forEach (function (_connection){_connection.addOutConnection (child);
});
$this._children.push (child._name);
child.start ();
var random = Math.random ();
if (random<$this._splitFactor) {$this._produceRandomProducer (random, child);
}
};

$this._run = function () { if ($this._consumption>$this._splitThreshold) {$this.split ();
}
$this.consume ();
$this._count+=1;
};

var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
                        $this.$constructors.forEach(function ($constructor) {
                            if ($constructor.length === $arguments.length && !$constructed) {
                                $constructor.apply($this, $arguments); $constructed = true;
                            }
                        });
return $this;};

return $this;
})();
$this.Energy = Energy;

return $this;
})();
$this.Automata = Automata;


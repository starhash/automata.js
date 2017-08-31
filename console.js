var $this = {};
var Console = (function () {
    var $this = {};
    $this.log = {};

    $this.log = function (message) {
    $this.log[Date.now] = message;
        console.log(message);
    };
    return $this;
})();
$this.Console = Console;


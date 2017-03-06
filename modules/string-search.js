module.exports = {
    'con':(function(){
        return function(p,w) {
            const pattern = new RegExp(p);
            return pattern.test(w);
        }
    })(),
    'http':(function(){
        return function(w) {
            const pattern = /^(https?:\/\/).*?/;
            return pattern.test(w);
        }
    })(),
    'coni':(function(){
        return function(p,w) {
            const pattern = new RegExp(p, 'i');
            return pattern.test(w);
        }
    })(),
    'ret':(function(){
        return function(p,w) {
            const pattern = new RegExp(p);
            return pattern.exec(w);
        }
    })(),
    'reti':(function(){
        return function(p,w) {
            const pattern = new RegExp(p,'i');
            return pattern.toString();
        }
    })()
}
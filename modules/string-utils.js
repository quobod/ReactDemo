function capitalizeFirstCharacter(word) {
	var word_split = null,
		line = "";
	if (word.trim().toLowerCase() === 'id' ||
		word.trim().toLowerCase() === 'ssn' ||
		word.trim().toLowerCase() === 'sku' ||
		word.trim().toLowerCase() === 'vm' ||
		word.trim().toLowerCase() === 'mac' ||
		word.trim().toLowerCase() === 'imei' ||
		word.trim().toLowerCase() === 'os' ||
		word.trim().toLowerCase() === 'atm' ||
		word.trim().toLowerCase() === 'pa' ||
		word.trim().toLowerCase() === 'api') {
		word = word.toUpperCase();
	} else if (word.match(/[-]/)) {
		if (null !== (word_split = word.split(['-'])).length > 0) {
			for (var i = 0; i<word_split.length; i++) {
				if (i < (word_split.length - 1)) {
					line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1) + '-';
				} else {
					line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1);
				}
			}
			return line;
		}
	} else if (word.match(/[ ]/)) {
		if (null !== (word_split = word.split([' '])).length > 0) {
			for (var i = 0; i<word_split.length; i++) {
				if (i < (word_split.length - 1)) {
					line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1) + ' ';
				} else {
					line += word_split[i].substring(0,1).toUpperCase() + word_split[i].substring(1);
				}
			}
			return line;
		}
	} else {
		return word.substring(0,1).toUpperCase() + word.substring(1);
	}
	return word;
}

function reverseString(word) {
	var word_split = null,
		line = '',
        temp;
        
	if (word.trim().toLowerCase() === 'id' ||
		word.trim().toLowerCase() === 'ssn' ||
		word.trim().toLowerCase() === 'sku' ||
		word.trim().toLowerCase() === 'vm' ||
		word.trim().toLowerCase() === 'mac' ||
		word.trim().toLowerCase() === 'imei' ||
		word.trim().toLowerCase() === 'os' ||
		word.trim().toLowerCase() === 'atm' ||
		word.trim().toLowerCase() === 'pa') {
		temp = '';
        for (var i = word.length -1; i > 0; i--) {
            temp += word[i];
        }
        return temp.toUpperCase();
	} else if (word.match(/[-]/)) {
		if (null !== (word_split = word.split(['-'])).length > 0) {
            temp = '';
			for (var i = 0; i < word_split.length; i++) {
				for (var j = word_split[j].length - 1; j > 0; j--) {
                    temp += word_split[j] + ' ';
                }
                if (i < (word_split.length - 1)) {
                    line += temp + ' ';
                } else {
                    line += temp;
                }
			}
			return line;
		}
	} else if (word.match(/[ ]/)) {
		if (null !== (word_split = word.split([' '])).length > 0) {
			temp = '';
			for (var i = 0; i < word_split.length; i++) {
				for (var j = word_split[j].length - 1; j > 0; j--) {
                    temp += word_split[j] + ' ';
                }
                if (i < (word_split.length - 1)) {
                    line += temp + ' ';
                } else {
                    line += temp;
                }
			}
			return line;
		}
	} else {
        temp = '';
		for (var i = word.length - 1; i > 0; i--) {
            if ( i < (word.length - 1)) {
                temp += word[i] + ' ';
            } else {
                temp += word[i];
            }
        }
        return temp;
	}
}

function cfc(word) {
	return capitalizeFirstCharacter(word);
}

function rs(word) {
    return reverseString(word);
}

module.exports = {
    cfc:(function(){return function(word){return cfc(word);}})(),
    rw:(function(){return function(word){return rs(word);}})()
};
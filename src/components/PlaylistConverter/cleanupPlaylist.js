
var regex = /\[.*?\] /g;

export const cleanupPlaylist = rawPlaylist => {
    const splitArray = rawPlaylist.split(/\r?\n/);
    let processedString = '';
    splitArray.forEach((val, i) => {
        const counter = i + 1;
        const suffix = counter < splitArray.length ? '\n' : '';
        return processedString += counter + '. ' + val + suffix;
    })
    return processedString.replace(regex, "");
};


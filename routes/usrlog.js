/**
 * Created by Schiappacassed on 30/05/2016.
 */
var dbw = require("./dbworker.js");

function usrlog (pool,id,area, msg){
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

    var inslog = "INSERT INTO USR_LOG values ("+date+", "+id+" , "+area+" , "+msg+" ) ";

    var db_log = new dbw(pool, inslog);

    var res = db_log.row;

};

module.exports = usrlog;
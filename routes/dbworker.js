/**
 * Created by schiappacassed on 11/05/2016.
 */

function dbworker(pool, usrquery){
    this.dbpool = pool;
    this.usrquery = usrquery;
    this.row= {};
    
    this.getRow = function(){   
    
   var query = this.usrquery;

        var m_row = this.dbpool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            this.res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

      // console.log('connected as id ' + connection.threadId);
      //  console.log("dbw2 : " + query);
        
        var y_rows =connection.query(query,function(err,rows2){

            connection.release();

            if(!err){
                console.log("DBW : "+rows2);
                return rows2;
            }
        });

        connection.on('error', function(err) {
            this.res.json({"code" : 100, "status" : "Error in connection database"});

        });
        return y_rows;
    });
    // console.log("tmp_rows : "+result);
    
        this.row = m_row;
        return m_row;
    };
    
this.getResult = function(callback){
   var query = this.usrquery;
    
    this.dbpool.getConnection(function(err,connection,result){
        connection.query(query,function(err,result){
            console.log(result);
callback(result)
        });
    });
    
};

this.myIExecute = function(){   
    
   var query = this.usrquery;
 
    this.dbpool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            this.res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

      // console.log('connected as id ' + connection.threadId);
      //  console.log("dbw2 : " + query);
        
        

        connection.query(query,function(err,rows){

            connection.release();

            if(!err){
               // if(rows.last){
                
                // tmp_rows = result.slice();
              //  console.log("dbw3 :" + rows);
               // }
            }
        });

        connection.on('error', function(err) {
            this.res.json({"code" : 100, "status" : "Error in connection database"});

        });
   
    });
    // console.log("tmp_rows : "+rows);
    
 
};

}
module.exports = dbworker;
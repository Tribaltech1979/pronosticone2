/**
 * Created by Daniele on 04/08/2015.
 */
//var hTableContainer = $('#classificat');
function getMyForm(tid , callback) {
    $.get("/gettorneo/" + tid, function (dataOutput) {
        //var dataOutputObject = JSON.parse(dataOutput);
        var dataOutputObject = dataOutput;
        var tableData = dataOutputObject, colArray = [], colHeaders = [], key;
        if (tableData.length >= 1) {
            //****ToDo Need a better way to make sure all columns are accounted for not just ones in the first record
            for (key in tableData[0]) {
                colArray.push({data: key});
                colHeaders.push(key);
            }
        }
        callback(tableData, colHeaders, colArray);
       // setupEvent(formName);
    });
}

function createTable(tableData, colHeaders, colArray) {
    var container = document.getElementById('classificat');

    var hot = new Handsontable(container, {
        data: tableData,
        minSpareRows: 1,
        rowHeaders: false,
        columns : colArray,
        colHeaders: colHeaders,
        contextMenu: false,
        readOnly : true
    });
   /* hTableContainer.handsontable({
        data: tableData,
        colHeaders: colHeaders,
        columns: colArray,
        contextMenu: true,
        autoWrapRow: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',

        afterChange: function (change, source) {
            if (source === 'loaddata') {
                return;
            }
            if (change && change.length === 1) {
                chgRowData = ht.getDataAtRow(change[0][0]);
                exist = objValueExists(ht.chgsArray, chgRowData, "_id")
                if (exist >= 0) {
                    removed = ht.chgsArray.splice(exist,1);
                }
                ht.chgsArray.push(chgRowData);
            }
        },
        afterCreateRow: function(i, amt) {
            var ht = hTableContainer.handsontable('getInstance');
            var rowData = ht.getDataAtRow(i);
            rowData._id = "NEW"+i;
        },
        beforeRemoveRow: function(i, amt) {
            var collName = $('#formID').text();
            var rmRowData = ht.getDataAtRow(i);
            //**In future maybe have where you can delete multiple rows
            //**Also check if new row being deleted before sending to server
            var json_send = {cName: collName, iDetails:rmRowData};
            $.ajax("/form/removeline", {
                data: JSON.stringify(json_send),
                type: "post", contentType: "application/json",
                success: function(result) {
                    console.log(result)
                }
            });
        }
    });
    var ht = hTableContainer.handsontable('getInstance');
    ht.chgsArray = [];
    hTableContainer.handsontable('selectCell', 1, 1);*/
}



$(document).ready(function () {
    var itid = $("input").filter("[name='torneo']").val();

    if (itid) {
        var tData = getMyForm(itid, createTable);
    }
});
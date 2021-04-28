(function () {
    var myConnector = tableau.makeConnector();
    myConnector.getSchema = function (schemaCallback) {
      const cols = [
        {
          id: "Ultima_actualizacion",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "Tipologia",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "ID",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "FechaHora",
          dataType: tableau.dataTypeEnum.string,
        },
        {
          id: "Porcentaje",
          dataType: tableau.dataTypeEnum.float,
        },
        {
          id: "Valor",
          dataType: tableau.dataTypeEnum.float,
        },
      ];
  
      let apiTableSchema = {
        id: "APIDATOS",
        alias: "Data from API",
        columns: cols,
      };
  
      schemaCallback([apiTableSchema]);
    };
  
    myConnector.getData = function (table, doneCallback) {
      let tableData = [];
      var i = 0;
      var j = 0;
      $.getJSON(
        "https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=2021-04-27T00:00&end_date=2021-04-27T23:59&time_trunc=hour",
        function (resp) {
          var apiData = resp.included;
          for (i = 0, len = apiData.length; i < len; i++) {
              for (j = 0; j < apiData[i].attributes.values.length; j++) {
                  var dic = apiData[i].attributes.values[j];
                  tableData.push({
                      FechaHora: dic.datetime,
                      Porcentaje: dic.percentage,
                      Valor: Number(dic.value),
                      Ultima_actualizacion: resp.data.attributes["last-update"],
                      Tipologia: apiData[i].type,
                      ID: apiData[i].id,
                  });
              }
          }
          table.appendRows(tableData);
          doneCallback();
        }
      );
    };
  
    tableau.registerConnector(myConnector);
  })();
  
  document.querySelector("#getData").addEventListener("click", getData);
  
  function getData() {
    tableau.connectionName = "API Datos";
    tableau.submit();
  }
//Open a database connection
var conn = $.db.getConnection();
var pstmt = null;
var rs = null;

//Get the Parameter "TYPE" sent
var sensorType = $.request.parameters.get("sensortype");

//Query to SELECT data
pstmt = conn.prepareStatement('SELECT TOP 1 "C_TEMPERATURE", "C_HUMIDITY", "C_LUMINOSITY" FROM "PENA"."T_IOT_ED315C1C503843C37AF9" ORDER BY "G_CREATED" DESC');

//Execute the query
rs = pstmt.executeQuery();
    
if (!rs.next()) {
    //Something went wrong: Return an error
    $.response.setBody("Failed to retrieve data");
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
} else {
    do {
        var temperature = rs.getString(1);
        var humidity = rs.getString(2);
        var luminosity = rs.getString(3);
    } while (rs.next())
}
    
pstmt.close();
conn.close();

if  (!sensorType){
    var resp = "Temperature: " + temperature + "°C and Humidity: " + humidity + " %";
} else {
    if  (sensorType === "1"){
        resp = "Temperature: " + temperature + "°C";
    } else {
        resp = "Humidity: " + humidity + " %";
    }
    
}

var output = JSON.stringify({ "replies": [{"type": "text", "content": resp}], "conversation": { "language": "en"}});

//Return the HTML response.
$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(output);
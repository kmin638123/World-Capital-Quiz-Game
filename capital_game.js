
// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

const config={
  apiKey: "AIzaSyBmLWdca46754O7Lie6fl0cFqBDF5POmU8",
  authDomain: "pr3-2-6e494.firebaseapp.com",
  projectId: "pr3-2-6e494",
  storageBucket: "pr3-2-6e494.appspot.com",
  messagingSenderId: "903861883407",
  appId: "1:903861883407:web:53a1b7fbbff40059f4497a",
  measurementId: "G-FDV339S0X1"
};

firebase.initializeApp(config);
firebase.analytics();

// Firebase App (the core Firebase SDK) is always required and must be listed first

var firebase=firebase.database();

$( document ).ready(function() {

  ideas = [];
  
  //helpme=[];
  //answer, capital,click,correct, country, lat, lng
  // arr[2],arr[1],arr[5],arr[3],arr[0],arr[7],arr[6]
  var data=[[]];
  var dbRef = firebase.ref('posts');

  function btt(myValue,myKey,index){
    var btn=document.createElement('button');
    btn.innerHTML="Remove";
      ideas.push([myValue[myKey].country,myValue[myKey].capital,myValue[myKey].answer, myValue[myKey].correct,btn,myValue[myKey].click,myValue[myKey].lng,myValue[myKey].lat,myValue[myKey].length])  
      var copy=[];
      for (var l=0;l<ideas.length;l++){
        copy[l]=ideas[l];
      }
      data.push([copy]);
      console.log(data);
      btn.onclick=function(){ 
        ideas[index][5]=1;
        
        data.push(index);
        console.log(data);
        dbRef.child(myKey).update({ click: "1" });
          var cs = document.getElementById("categories");
          var v = cs.options[cs.selectedIndex].value;
          if (v=="Correct"){
            printcate(1);
            hover();
          }
          else if(v=="Wrong"){
            printcate(0);
            hover();
          }
          else if(v=="All"){
            printIdeas();
            hover();
          }
      }
      
  }

  
  dbRef.get().then((snapshot) => {
    if (snapshot.exists()) {
     //console.log(snapshot.val());
      var myValue = snapshot.val();
      var keyList = Object.keys(myValue);
    
    for(var i=0;i<keyList.length;i++) {
      var myKey = keyList[i];
      var btn=document.createElement('button');
      btn.innerHTML="Remove";
      //ideas.push([myValue[myKey].country,myValue[myKey].capital,myValue[myKey].answer, myValue[myKey].correct,btn,myValue[myKey].click,myValue[myKey].lng,myValue[myKey].lat,myValue[myKey].length])  

      btt(myValue,myKey,i);   
    
    }     
      //console.log(ideas);
      
      printIdeas();
      hover();

    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  fst=[];
  var j=0;
  window.pairs =[];
  window.coordinates=[];

  var country_capital_pairs = window.pairs;
  var lnglat=window.coordinates;
  
  var pr2__capital=document.getElementById('pr2__capital');
  pr2__capital.focus();

  $.ajax({
    url:"https://cs374.s3.ap-northeast-2.amazonaws.com/country_capital_geo.csv",
    dataType:"text",
    success:function(data)
    {
      var employee_data = data.split(/\r?\n|\r/);
      for(var count = 1; count<employee_data.length-1; count++)
      {
       var cell_data = employee_data[count].split(",");
       var cc={
         country: cell_data[0],
         capital: cell_data[1]
       };
       
       var ll={
        country: cell_data[0],
        coordinates: [cell_data[2],cell_data[3]]
       }
       window.pairs.push(cc);
       //console.log(cc);
       window.coordinates.push(ll);
      }
  
      var capitals=[];
      for(var i=0;i<country_capital_pairs.length;i++){
        capitals[i]=country_capital_pairs[i].capital;
      }

      $("#pr2__capital").autocomplete({
        source: capitals,
        matchContains:true,
        minLength: 2,
        select: function(e,ui){
          pr2__capital.value=ui.item.value;
          events();
          ui.item.value = "";
          // it will clear field 
        }
      })

      $.ui.autocomplete.filter = function (array, term) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });
      };
      
      rand();
      bindEvents();

    }
  });

  var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL satellite-streets-v11
    center: [0,0], // starting position [lng, lat]
    zoom: 4 // starting zoom
  });
 
  function rand(){
    var pr2__country=document.getElementById('pr2__country');
    var num=Math.floor(Math.random()*(country_capital_pairs.length));
    var cnt=country_capital_pairs[num].country;
    pr2__country.innerHTML=cnt;
    pr2__capital.focus();
    fst.push(cnt);
    pr2__capital.value='';

    var lng=lnglat[num].coordinates[0];
    var lat=lnglat[num].coordinates[1];

    map.setCenter([lng,lat]);
    
    var over=0;
    pr2__country.addEventListener("mouseover",function(){
      over=true;
      setTimeout(function(){
        if(over){
          map.setCenter([lng,lat]);
        }
      },500);  
    });  
    pr2__country.addEventListener("mouseout",function(){
        over=false; 
        var Map = document.getElementById('map');
        Map.style.border = '0px';
    });

  }

  
  function events(){
    if (pr2__capital.value=='') {
      pr2__capital.focus();
    }
    else{
      var pr2__country=document.getElementById('pr2__country');
      var num=Math.floor(Math.random()*(country_capital_pairs.length));
      var cnt=country_capital_pairs[num].country;
      fst.push(cnt);
      pr2__country.innerHTML=cnt;
      pr2__capital.focus();
      var len=fst.length;
      var con=fst[len-2];
      var ct,second,third,fourth,lng,lat,lng2,lat2;
      for(var i=0;i<country_capital_pairs.length;i++){
        if(window.pairs[i].country==con){
          ct=window.pairs[i].capital;
          lng=lnglat[i].coordinates[0];
          lat=lnglat[i].coordinates[1];
        } 
      }
      var btn=document.createElement('button');
      btn.innerHTML="Remove";

      var mapcon=fst[len-1];
      for(var i2=0;i2<country_capital_pairs.length;i2++){
        if(window.pairs[i2].country==mapcon){
          lng2=lnglat[i2].coordinates[0];
          lat2=lnglat[i2].coordinates[1];
        }
      }
      map.setCenter([lng2,lat2]);
      
      if((ct.toUpperCase())==((pr2__capital.value.toUpperCase()).replace(/(^\s*)|(\s*$)/g, ""))){
        second=ct;
        third=ct;
        third=third.fontcolor("green"); 
        second=second.fontcolor("green");
        con=con.fontcolor("green");
        fourth=1;
      } 
      else {
        second=pr2__capital.value;
        second=second.fontcolor("red");
        second=second.strike();
        third=ct.italics();
        third=third.fontcolor("red");
        con=con.fontcolor("red");
        fourth=0;
      }

      ideasindex=ideas.length;
      ideas.push([con, second,third,fourth,btn,j,lng,lat,ideasindex]);
      copy=[];
      for (var l=0;l<ideas.length;l++){
        copy[l]=ideas[l];
      }
      data.push([copy]);

      // console.log([lng,lat]);
      // map.setCenter([lng,lat]);

      console.log(data);
      
      var ideaslength=ideas.length;
      var postListRef = firebase.ref('posts');
      var llen=ideas.length;


      btn.onclick=function(){

        dbRef.get().then((snapshot) => {
          if (snapshot.exists()) {
            data.push(llen-1);
           //console.log(snapshot.val());
            var myValue = snapshot.val();
            var keyList = Object.keys(myValue);
            var myKey=keyList[llen-1]; 
            
            dbRef.child(myKey).update({ click: "1" });
            ideas[llen-1][5]=1;  
            console.log(data);

            var cs = document.getElementById("categories");
            var v = cs.options[cs.selectedIndex].value;
            if (v=="Correct"){
              printcate(1);
              hover();
            }
            else if(v=="Wrong"){
              printcate(0);
              hover();
            }
            else if(v=="All"){
              printIdeas();
              hover();
            }

          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });

          
        } 
      

      postListRef.remove();

      for (var k=0;k<ideaslength;k++){
          writetodatabase(ideas[k]);
      }  

      printIdeas();
     
      hover();
      
      pr2__capital.value='';
    }
  }
  function hover(){
    var mouseover=false;
    document.querySelectorAll('#table td')
    .forEach(e => e.addEventListener("mouseover", function() {
      mouseover=true;
      setTimeout(function(){
        if(mouseover){
          var Map = document.getElementById('map');
          var check=0;
          var index=0;
          var lg,lt=0;
          
          for (var i0=0;i0<ideas.length;i0++){
            //console.log(ideas[i0][2]+"<button>Remove</button>");
            //console.log(e.innerHTML);
            if(ideas[i0][0]==e.innerHTML) {
              check=1;
              index=i0;
            }
            
            if(ideas[i0][2]+"<button>Remove</button>"==e.innerHTML){
              check=2;
              index=i0;
            }
          }
          if (check==1) {
            map.setCenter([ideas[index][6],ideas[index][7]]);
            Map.style.border = '3px solid #FFA500';
            map.setZoom(4);
          }
          else if(check==2){
            map.setCenter([ideas[index][6],ideas[index][7]]);
            Map.style.border = '3px solid #000000';
            map.setZoom(6);
            map.setStyle('mapbox://styles/mapbox/'+'dark-v10');
          }
          else{
            for(var i2=0;i2<lnglat.length;i2++){
              if(window.coordinates[i2].country==e.innerHTML){
                lg=lnglat[i2].coordinates[0];
                lt=lnglat[i2].coordinates[1];
                check=3;
              } 
            }
            if (check==3){
              //console.log([lg,lt]);
              map.setCenter([lg,lt]);
              Map.style.border = '3px solid #FFA500';
              map.setZoom(4);
            }
          }
        }
      },500);  
    }));  
    document.querySelectorAll('#table td')
    .forEach(e => e.addEventListener("mouseout", function() {
      mouseover=false; 
      var Map = document.getElementById('map');
      Map.style.border = '0px';  
      map.setStyle('mapbox://styles/mapbox/'+'satellite-streets-v11');
      var printTable= document.getElementById('table');
      for(var index=0;index<printTable.rows.length;index++){
        printTable.rows[index].style.backgroundColor='#eee';
      }
    }));  

    var mouseover2=false;
    document.querySelectorAll('#table td')
    .forEach(e => e.addEventListener("mouseover", function() {
      mouseover2=true;
      if(mouseover2){
        var check=0;
        var index=0;
        var hov=[];
        //console.log(fst);

        for (var f=0;f<fst.length;f++){
          if(fst[f]==e.innerHTML){
            document.getElementById('table').rows[1].style.backgroundColor = '#d3d3d3';
          }
        }

        for (var c=0;c<ideas.length;c++){
          if(ideas[c][5]==0){
            hov.push(ideas[c]);
          }
        }
        
        for (var i0=0;i0<hov.length;i0++){
          //console.log(ideas[i0][2]+"<button>Remove</button>");
          //console.log(e.innerHTML);
          if(hov[i0][0]==e.innerHTML) {
            check=1;
            index=i0;
          }
          
          if(hov[i0][2]+"<button>Remove</button>"==e.innerHTML){
            check=2;
            index=i0;
          }
        }
        if(check==1||check==2){
          document.getElementById('table').rows[index+2].style.backgroundColor = '#d3d3d3';
        }
      }  
    }));  
    document.querySelectorAll('#table td')
    .forEach(e => e.addEventListener("mouseout", function() {
      mouseover=false; 
      var Map = document.getElementById('map');
      Map.style.border = '0px';  
      map.setStyle('mapbox://styles/mapbox/'+'satellite-streets-v11');
      var printTable= document.getElementById('table');
      for(var index=0;index<printTable.rows.length;index++){
        printTable.rows[index].style.backgroundColor='#eee';
      }
    }));  

  }

  function writetodatabase(arr){
      //firebase database
      
      var postListRef = firebase.ref('posts');
      //postListRef.remove();
      var newPostRef = postListRef.push();
      newPostRef.set({
          country:arr[0],
          capital:arr[1],
          answer:arr[2],
          correct:arr[3],
          click:arr[5],
          lng:arr[6],
          lat:arr[7],
          length:arr[8]
      });
      
  }
  
  function bindEvents(){
    pr2__capital.addEventListener("keydown", function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("pr2__button").click();
      }
    });
    var pr2__button=document.getElementById('pr2__button');
    pr2__button.onclick=function(){
      events(); 
      document.getElementById("categories").selectedIndex = 0
    }
    //clear
    var clear=document.getElementById('pr3__clear');
    clear.onclick=function(){
      var printTable=document.getElementById('table');
      var numRows=printTable.rows.length;
      var hov=[];
      for (var c=0;c<ideas.length;c++){
        if(ideas[c][5]==0){
          hov.push(ideas[c]);
        }
      }

      if (hov.length==0){
        alert('No items to clear');
      }
      else{
        var postListRef = firebase.ref('posts');
        postListRef.remove();
        ideas=[];
        data.push([ideas]);
        console.log(data);
        pr2__capital.focus();
        printIdeas();
      }
    }

    var undo=document.getElementById('pr3__undo');
    undo.onclick=function(){
      var postListRef = firebase.ref('posts');
      //console.log(data.pop());

      if (data.length==1){
          alert('Nothing to undo');
      }
      else{
        //console.log(data);
        var idx=data[data.length-1];
        if (Number.isInteger(idx)){
          console.log('hi');

          dbRef.get().then((snapshot) => {
            if (snapshot.exists()) {
             //console.log(snapshot.val());
              var myValue = snapshot.val();
              var keyList = Object.keys(myValue);
              var myKey=keyList[idx]; 
              
              dbRef.child(myKey).update({ click: "0" });
              data.pop();
              ideas[idx][5]=0;
              //console.log(data);
              printIdeas();
              hover();
              console.log(data);
  
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

        }
        else{
          var pideas=[];
          data.pop();
          pideas=(data[data.length-1]);

          if(Number.isInteger(pideas)){
            //console.log(pideas);
            var id=0;
            for (var n=data.length-2;n>0;n--){
              if(Number.isInteger(data[n])) id=0;
              else{
                id=n;
                break;
              }
            }
            ideas=data[id][0];
            console.log(data);
          }
          else{
           // console.log(pideas);
           // console.log(pideas.length);
            console.log(data);
            if(pideas.length==0){
              ideas=[];
            }else{
              ideas=pideas[0];
            }
          }
          //console.log(ideas);
          printIdeas();
          hover();
          postListRef.remove();

          for (var k=0;k<ideas.length;k++){
            writetodatabase(ideas[k]);
          }
        }  
      }
    }

    var reset=document.getElementById('pr3__reset');
    reset.onclick=function(){
      rand();
      var postListRef = firebase.ref('posts');
      postListRef.remove();
      data=[[]];
      ideas=[];
      printIdeas();
    }

  }

  function printIdeas() {
    var printTable = document.getElementById('table');
    
    var numRows = printTable.rows.length;
    
    for(var i=0;i<numRows-2;i++) {
      printTable.deleteRow(2);
    }
    var k=0
    

    for(var i=0;i<ideas.length;i++) { 
      if (ideas[i][5]==0){
        var newRow = printTable.insertRow(k+2);
        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCountry = ideas[i][0];
        var newCapital = ideas[i][1];
        var Answer = ideas[i][2];
        var btn=ideas[i][4];

        newCell1.innerHTML = newCountry;    
        newCell2.innerHTML = newCapital;
        newCell3.innerHTML = Answer;
        newCell3.appendChild(btn);
        k++;
      }
    }
    if(k==0){
      var newRow = printTable.insertRow(2);
      var newCell1 = newRow.insertCell(0);
      var newCell2 = newRow.insertCell(1);
      var newCell3 = newRow.insertCell(2);
      newCell1.innerHTML="";
      newCell2.innerHTML="The list is empty";
      newCell3.innerHTML="";
    }  
    
    
  }  

  function printcate(index){
    var printTable = document.getElementById('table');
    var numRows = printTable.rows.length;
    for(var i=0;i<numRows-2;i++) {
      printTable.deleteRow(2);
    }
    var h=0
    for(var i=0;i<ideas.length;i++) { 
      if (ideas[i][5]==0){
        if (ideas[i][3]==index){
          var newRow = printTable.insertRow(h+2);
          var newCell1 = newRow.insertCell(0);
          var newCell2 = newRow.insertCell(1);
          var newCell3 = newRow.insertCell(2);
          var newCountry = ideas[i][0];
          var newCapital = ideas[i][1];
          var Answer = ideas[i][2];
          var btn=ideas[i][4];

          newCell1.innerHTML = newCountry;    
          newCell2.innerHTML = newCapital;
          newCell3.innerHTML = Answer;
          newCell3.appendChild(btn);
          h++;
        }  
      }
    }
    if(h==0){
      var newRow = printTable.insertRow(2);
      var newCell1 = newRow.insertCell(0);
      var newCell2 = newRow.insertCell(1);
      var newCell3 = newRow.insertCell(2);
      newCell1.innerHTML="";
      newCell2.innerHTML="The list is empty";
      newCell3.innerHTML="";
    }  
  }

  $('#categories').on('change', function () {
    var selectVal = $("#categories option:selected").val();
    var printTable = document.getElementById('table');
    if (selectVal=="Correct"){ 
      printcate(1);
      hover();
      if(printTable.rows.length==2){
        var newRow = printTable.insertRow(2);
        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        newCell1.innerHTML="";
        newCell2.innerHTML="The list is empty";
        newCell3.innerHTML="";
      }
      
    }
    else if (selectVal=="Wrong"){
      printcate(0);
      hover();
      if(printTable.rows.length==2){
        var newRow = printTable.insertRow(2);
        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        newCell1.innerHTML="";
        newCell2.innerHTML="The list is empty";
        newCell3.innerHTML="";
      }
      
    }
    else if(selectVal=="All"){
        printIdeas();
        hover();
        if(printTable.rows.length==2){
          var newRow = printTable.insertRow(2);
          var newCell1 = newRow.insertCell(0);
          var newCell2 = newRow.insertCell(1);
          var newCell3 = newRow.insertCell(2);
          newCell1.innerHTML="";
          newCell2.innerHTML="The list is empty";
          newCell3.innerHTML="";
        }
    }
    
  }); 

});

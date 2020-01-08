var process_wb = (function() {
	var to_json = function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return JSON.stringify(result, 2, 2);
	};

	return function process_wb(wb,$callback) {
		var output = "";
		output = to_json(wb);  
		$callback(output);
		if(typeof console !== 'undefined') console.log("output", new Date());
	};
})();

var do_file = (function() {
	var xw = function xw(data, cb,$callback) {
		var worker = new Worker(xlsxworker);
		worker.onmessage = function(e) {
			switch(e.data.t) {
				case 'ready': break;
				case 'e': console.error(e.data.d); break;
				case 'xlsx': cb(JSON.parse(e.data.d),$callback); break;
			}
		};
		worker.postMessage({d:data,b: 'binary' });
	};
	return function do_file(files,$callback) {
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			if(typeof console !== 'undefined') console.log("onload", new Date() );
			var data = e.target.result;
			xw(data, process_wb,$callback);
		};
		reader.readAsBinaryString(f);
	 
	};
})();


var resolving = function(data){
		data =  JSON.parse(data);
		var keys = [];
		for(var x in data)keys.push(x);
		$json_arr = data[keys[0]];
        $data_json = [];
	    for(var x in $json_arr)
	    {
	    	if($json_arr[x].length>0) $data_json.push($json_arr[x]);
	    }

	    $json = {
	    	title:$data_json[0][0],
	    	org:{
	    		unit:$data_json[1][1],
	    		staff:$data_json[1][4],
	    	},
	    	course:{
	    		title:$data_json[2][1],
	    		category:$data_json[2][4],
	    	},
	    	object:{
	    		grade:[
                   $data_json[3][1],
                   $data_json[3][2],
	    		],
	    		class_hour:  $data_json[3][4],
	    	},
	    	intro:$data_json[4][1],
	    	target:$data_json[5][1],
	    };
	    $json['unit'] = [];
	    for (var i = 7; true; i++) {
	    	$unit = $data_json[i];
	    	if($unit[0] != null) break;
            $json['unit'].push( {
            	unit:$unit[1],
            	title:$unit[2],
            	target:$unit[3],
            	content:$unit[4],
            });
	    }
	    $json['force'] = $data_json[i];
        i++;
        $json['evaluate'] = $data_json[i];
        i++;
        $json['result'] = $data_json[i];
        return $json;
	   // console.log(JSON.stringify($json));

}

var undefined_string = function($value){
		if (typeof($value) == "undefined"){ 
		   return '';
		}
		return $value;
}


var  resolving_new = function (data) {



	data =  JSON.parse(data);

	var keys = [];
	for(var x in data)keys.push(x);
	$json_arr = data[keys[0]];
	$data_json = [];
	for(var x in $json_arr)
	{
		if($json_arr[x].length>0) $data_json.push($json_arr[x]);
	}

 

	$json = {
		title: undefined_string($data_json[0][0]) ,
		org:{
			unit:undefined_string($data_json[1][1]),
			staff: undefined_string($data_json[1][4]),
		},
		course:{
			title: undefined_string($data_json[2][1]),
			category: undefined_string($data_json[2][4]),
		},
		object:{
			grade:{
               min:undefined_string($data_json[3][1]),
               max:undefined_string($data_json[3][2]),
			},
			class_hour:$data_json[3][4],
		},
		member_count:{
               min:undefined_string($data_json[4][1]),
               max:undefined_string($data_json[4][2]),
		},
		intro:$data_json[5][1],
		target:$data_json[6][1],
	};
 

	$unit_data = [];
	for (var i = 8; true; i++) {

		//console.log($data_json[i] );
		 if($data_json[i][0] == null)
		 {
		 	  
			 $data_json[i].splice(0,1);
			 $unit_data.push($data_json[i]);
		 }
		 else
		 {
		 ////	console.log($data_json[i][0]);
		 	break;
		 }
 
		/// console.log($data_json[i][0]);
	}

	// console.log($unit_data);

	$unit_data_true = [];

	$unit_one_data = {};


	for(var j = 0 ; j < $unit_data.length ; j++ )
	{
		if($unit_data[j][0] != null)
		{
			if($unit_one_data.name != undefined )
			{
				$unit_data_true.push($unit_one_data);
				//console.log('111eeeeeeeefeberlktmrejoi111');
			} 
				$unit_one_data = {
					name: undefined_string($unit_data[j][0]),
					title:undefined_string( $unit_data[j][1]),
					content:undefined_string($unit_data[j][2]),
					class:[
	                    {
	                    	name:undefined_string($unit_data[j][3]),
	                    	title:undefined_string($unit_data[j][4]),
	                    	content:undefined_string($unit_data[j][5]),
	                    }
					],
				};
		}else{
               $unit_one_data.class.push({
	                    	name:undefined_string($unit_data[j][3]),
	                    	title:undefined_string($unit_data[j][4]),
	                    	content:undefined_string($unit_data[j][5]),
               });
		}
		if(j == $unit_data.length-1)
		{
			$unit_data_true.push($unit_one_data);
		}

	}

	//console.log($unit_data_true);
//console.log($data_json);

 
    ///课程实施
    $json['force'] = {
       "tool"  : undefined_string($data_json[i][3]),
    };
    i++;
    
    ///场地设备
    $json['force']['device'] = undefined_string($data_json[i][2]);
    i++;

    //实施安排
    $json['force']['arrange'] = undefined_string($data_json[i][2]);
	i++;

	///课程评价
	$json['evaluate'] = undefined_string($data_json[i][1]);
	i++;

	//六、成果反馈
	$json['result'] = undefined_string($data_json[i][1]);

 

	 


	$json['unit'] = $unit_data_true;
//	console.log($json);

	return $json;

//	console.log($json);
//	return $json;
}

 
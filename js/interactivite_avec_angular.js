var appli = angular.module('mon_appli', []);


appli.config(['$interpolateProvider', function($interpolateProvider) {
  	$interpolateProvider.startSymbol('{*');
  	$interpolateProvider.endSymbol('*}');    
       }
]);

appli.factory('serviceDates', ['$q', function($q){
	var les_services_dates = {};

	var tableau_des_dates = les_services_dates.tableau_des_dates = new Array();

	function calculeDates(position, debutSemaine){
		var finSemaine = new Date(debutSemaine);
		finSemaine.setDate(debutSemaine.getDate() + 6) ;
		tableau_des_dates[position] = [debutSemaine, finSemaine];
		//console.log(tableau_des_dates);
	}

	les_services_dates.initialiseBufferDates = function(){
		var dateAvant = new Date(), dateMaintenant = new Date(), dateApres = new Date();
		var day = dateMaintenant.getDay();
		diff = dateMaintenant.getDate() - day + (day == 0 ? -6:1); 
		//console.log(dateMaintenant);
		calculeDates(1, new Date(dateMaintenant.setDate(diff)));
		calculeDates(0, new Date(dateAvant.setDate(diff - 7)));		
		calculeDates(2, new Date(dateApres.setDate(diff + 7)));
	}
 	les_services_dates.metAJourBufferDates = function(decalage){
 		//console.log(decalage);
		if (decalage == "shiftRight"){

			angular.copy(tableau_des_dates[1],tableau_des_dates[0]) ;
			angular.copy(tableau_des_dates[2],tableau_des_dates[1]) ;			
			//tableau_des_dates[1] = tableau_des_dates[2];
			var d = new Date(tableau_des_dates[2][0]);
			calculeDates(2, new Date(d.setDate(d.getDate() + 7)));	
		//console.log(tableau_des_dates);
		}
		else 
		if (decalage == "shiftLeft"){
			
			/*tableau_des_dates[2] = tableau_des_dates[1];
			tableau_des_dates[1] = tableau_des_dates[0];*/
			angular.copy(tableau_des_dates[1],tableau_des_dates[2]) ;
			angular.copy(tableau_des_dates[0],tableau_des_dates[1]) ;				
			var d = new Date(tableau_des_dates[0][0]);
			calculeDates(0, new Date(d.setDate(d.getDate() - 7)));	

		}
		//console.log(tableau_des_dates);		
}
	return les_services_dates;
}]);



appli.factory('gestionDesPanneaux',[ 'serviceDates', '$q', function(serviceDates, $q){
var gestion_des_panneaux = {};

	var animation_en_cours = false;	
	var t_rightShift  = [1, 2, 0];
	var t_leftShift   = [2, 0, 1];

	gestion_des_panneaux.champ_gauche = 0, gestion_des_panneaux.champ_centre = 1, gestion_des_panneaux.champ_droite = 2;
	

	/*function metAJourPanneau(panneau, numero_panneau){
		var debutSemaine = serviceDates.tableau_des_dates[numero_panneau][0], 
			finSemaine   = serviceDates.tableau_des_dates[numero_panneau][1];

		texte_date = "Semaine du " + debutSemaine.getDate() + "/" + (debutSemaine.getMonth() + 1)  +  "/"  +  debutSemaine.getFullYear();
		texte_date +=  " au " 	   + finSemaine.getDate()   + "/" + (finSemaine.getMonth() + 1)    +  "/"  +  finSemaine.getFullYear();
		champDate			= $("." + panneau).find(".champDate");
		champDate.text(texte_date);	
	}*/

	gestion_des_panneaux.initialisePanneaux = function(){
		serviceDates.initialiseBufferDates();
		//console.log(serviceDates.tableau_des_dates);
		/*gestion_des_panneaux.metAJourPanneau("leftPanel"   , 0);
		gestion_des_panneaux.metAJourPanneau("centerPanel" , 1);
		gestion_des_panneaux.metAJourPanneau("rightPanel"  , 2);*/
	}


	gestion_des_panneaux.defilementVersLaDroite = function(scope){

			if (! animation_en_cours){
					animation_en_cours = true ;

					
					$(".centerPanel").animate(
									{"left" : "-=100%"},
									"slow"
						);
					$(".rightPanel").animate(
									{"left" : "-=100%"},
									"slow"
						)
	 			.queue(function(){
					serviceDates.metAJourBufferDates("shiftRight");
					console.log("vers la droite");
					//metAJourPanneau("leftPanel", 2);
					//console.log(t_leftShift[gestion_des_panneaux.champ_gauche]);					
					gestion_des_panneaux.champ_gauche = t_leftShift[gestion_des_panneaux.champ_gauche];
					//console.log(gestion_des_panneaux.champ_gauche);	


					//console.log(t_leftShift[gestion_des_panneaux.champ_centre]);	
					gestion_des_panneaux.champ_centre = t_leftShift[gestion_des_panneaux.champ_centre];
					//console.log(gestion_des_panneaux.champ_centre);		
									
					//console.log(t_leftShift[gestion_des_panneaux.champ_droite]);				
					gestion_des_panneaux.champ_droite = t_leftShift[gestion_des_panneaux.champ_droite];
					//console.log(gestion_des_panneaux.champ_droite);							


					//console.log(gestion_des_panneaux.champ_gauche  + "-" + gestion_des_panneaux.champ_centre + "-" + gestion_des_panneaux.champ_droite);
					// angular.copy(t_leftShift[gestion_des_panneaux.champ_gauche], gestion_des_panneaux.champ_gauche);
					// angular.copy(t_leftShift[gestion_des_panneaux.champ_droite], gestion_des_panneaux.champ_droite);
					// angular.copy(t_leftShift[gestion_des_panneaux.champ_centre], gestion_des_panneaux.champ_centre);					
					/*texte_date = "Semaine du " + debutSemaine.getDate() + "/" + (debutSemaine.getMonth() + 1)  +  "/"  +  debutSemaine.getFullYear();
					texte_date +=  " au " 	   + finSemaine.getDate()   + "/" + (finSemaine.getMonth() + 1)					
					champDate			= $(".leftPanel").find(".champDate").text(texte_date);	*/				
					scope.$apply();
			
					//console.log(gestion_des_panneaux.champ_gauche  + "-" + gestion_des_panneaux.champ_centre + "-" + gestion_des_panneaux.champ_droite);
					/*console.log("scope");
					console.log(scope.champ_gauche);		
					console.log(scope.champ_centre);			
					console.log(scope.champ_droite);
					console.log(scope.dates_a_afficher);	*/		
					//console.log(serviceDates.tableau_des_dates[0]);
					$(this).dequeue();	 				
	 			})				
				.queue(function(){
	
					$(".leftPanel").css("left", "100%");

					var centre = $(".centerPanel"), droite = $(".rightPanel"), gauche = $(".leftPanel");	
		
					centre.removeClass("centerPanel");
					droite.removeClass("rightPanel").addClass("centerPanel");
					gauche.removeClass("leftPanel").addClass("rightPanel");
					centre.addClass("leftPanel");
	
					animation_en_cours = false ;				
					$(this).dequeue();
				});
			}
	}		


	gestion_des_panneaux.defilementVersLaGauche = function(scope){

			if (! animation_en_cours){
				animation_en_cours = true ;
	
	 			$(".centerPanel").animate(
	 							{"left" : "+=100%"},
	 							"slow"
	 				);
	 			$(".leftPanel").animate(
	 							{"left" : "+=100%"},
	 							"slow"
	 				)
	 			.queue(function(){
					serviceDates.metAJourBufferDates("shiftLeft");
					//metAJourPanneau("rightPanel", 0);					
					 /*angular.copy(t_rightShift[gestion_des_panneaux.champ_gauche], gestion_des_panneaux.champ_gauche);
					 angular.copy(t_rightShift[gestion_des_panneaux.champ_droite], gestion_des_panneaux.champ_droite);
					 angular.copy(t_rightShift[gestion_des_panneaux.champ_centre], gestion_des_panneaux.champ_centre);	*/
					gestion_des_panneaux.champ_gauche = t_rightShift[gestion_des_panneaux.champ_gauche];
					gestion_des_panneaux.champ_centre = t_rightShift[gestion_des_panneaux.champ_centre];
					gestion_des_panneaux.champ_droite = t_rightShift[gestion_des_panneaux.champ_droite];					 				
					/*texte_date = "Semaine du " + debutSemaine.getDate() + "/" + (debutSemaine.getMonth() + 1)  +  "/"  +  debutSemaine.getFullYear();
					texte_date +=  " au " 	   + finSemaine.getDate()   + "/" + (finSemaine.getMonth() + 1)					
					champDate			= $(".rightPanel").find(".champDate").text(texte_date);	*/				
					scope.$apply();
					$(this).dequeue();	 				
	 			})
	 			.queue(function(){
					$(".rightPanel").css("left", "-100%");

					var centre = $(".centerPanel"), droite = $(".rightPanel"), gauche = $(".leftPanel");	
		
					centre.removeClass("centerPanel");
					droite.removeClass("rightPanel").addClass("leftPanel");
					gauche.removeClass("leftPanel").addClass("centerPanel");
					centre.addClass("rightPanel");
					//console.log()

					animation_en_cours = false ;		
					$(this).dequeue();
				});
			}
	}

	return gestion_des_panneaux;
}]);





appli.directive('defileur', ['$q','gestionDesPanneaux', function($q, panneaux){
 	return {
 		restrict: 'A',
 		link : function(scope, element, attributes){
 			panneaux.initialisePanneaux();	
 		}
	}
}]);




appli.directive('directionDroite', ['gestionDesPanneaux', 'serviceDates', function(panneaux, serviceDates){

	return {
		restrict : 'A',
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				panneaux.defilementVersLaDroite(scope);
			});	
		}	

	}

}]);

appli.directive('directionGauche', ['gestionDesPanneaux', function(panneaux){

	return {
		restrict : 'A',
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				panneaux.defilementVersLaGauche(scope);
			});	
		}	

	}

}]);


appli.controller("controleur", ['$q', 'serviceDates', 'gestionDesPanneaux', '$scope', function($q, serviceDates, gestionDesPanneaux, $scope){

 	$scope.dates_a_afficher = serviceDates.tableau_des_dates;
 	$scope.gestionDesPanneaux = gestionDesPanneaux;
 	//$scope.champ_gauche = gestionDesPanneaux.champ_gauche/**/;
 	//$scope.champ_centre = gestionDesPanneaux.champ_centre/**/;
	//$scope.champ_droite = gestionDesPanneaux.champ_droite/**/;

 	/*$scope.$watch('dates_a_afficher', function(newValue, oldValue) {
 		if (newValue !== oldValue){
 			console.log(newValue);
 		}

 	}, true);*/


$scope.$watch('gestionDesPanneaux.champ_gauche', function(newValue, oldValue) {
 		//if (newValue !== oldValue){
 			console.log("champ gauche change : " + newValue);
 		//}

 	}, true);



}]);




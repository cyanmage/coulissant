var appli = angular.module('appli', ['defileur']);


appli.config(['$interpolateProvider', function($interpolateProvider) {
  	$interpolateProvider.startSymbol('{*');
  	$interpolateProvider.endSymbol('*}');    
       }
]);
var module_defileur = angular.module('defileur', []);





/*/////////////////////////////////////////////////////////////////////////////////*/
///////////////////////////////////////////////////////////////////////////////////*/
/*                                                                                 */
/*                                                                                 */
/*                    Controleur associé au défileur                               */
/*                                                                                 */
/*                                                                                 */
///////////////////////////////////////////////////////////////////////////////////*/
/////////////////////////////////////////////////////////////////////////////////////


module_defileur.controller("controleur_defileur", ['$q', 'gestionDesPanneaux', '$scope', function($q, gestionDesPanneaux, $scope){

 	$scope.libelleBtnAttachDetach = "Détacher";
 	$scope.gestionDesPanneaux = gestionDesPanneaux;

	$scope.$on("changementDirection", function(event, data){
		console.log(data);
	});


	$scope.cache = new Array();

	$scope.attacheDetacheStickers= function(){
		if ($scope.libelleBtnAttachDetach ==  "Attacher"){
			$scope.libelleBtnAttachDetach =  "Détacher"; 
			$scope.cache.push($(".sticker").detach());
		}
		else{
			$scope.libelleBtnAttachDetach =  "Attacher"; 	
		}	 
	}

}]);



/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/

//													  DIRECTIVES

/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/


module_defileur.directive('defileur', ['$q','gestionDesPanneaux', function($q, panneaux){
 	return {
 		restrict: 'A',
 		link : function(scope, element, attributes){
 			//element.find(".centerPanel").addClass()
 			//panneaux.initialisePanneaux();	
 		}
	}
}]);


module_defileur.directive('directionDroite', ['gestionDesPanneaux', function(panneaux){

	return {
		restrict : 'A',
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				panneaux.defilementVersLaDroite(scope);
				scope.$emit("changementDirection", "flecheGauche");
			});	
		}	

	}

}]);

module_defileur.directive('directionGauche', ['gestionDesPanneaux', function(panneaux){

	return {
		restrict : 'A',
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				panneaux.defilementVersLaGauche(scope);
				scope.$emit("changementDirection", "flecheDroite");				
			});	
		}	

	}

}]);






/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************            LES SERVICES         ***************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

module_defileur.factory('serviceDates', ['$q', function($q){
	var les_services_dates = {};


	var tableau_des_dates = les_services_dates.tableau_des_dates = new Array();

	var nbJoursDecalage = 1;

	var calculeDates = function(position, debutSemaine){
		var finSemaine = new Date(debutSemaine);
		finSemaine.setDate(debutSemaine.getDate() + 6) ;
		tableau_des_dates[position] = [debutSemaine, finSemaine];
	}

	/*Retourne une date formatée sous la forme yyyymmjj*/
	les_services_dates.retourneDateEnCours = function(date){
		var date = tableau_des_dates[1][0];
		return "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
 	}

	les_services_dates.initialiseBufferDates = function(){
		var dateAvant = new Date(), dateMaintenant = new Date(), dateApres = new Date();
		diff = 0;

		var day = dateMaintenant.getDay();
		//diff = dateMaintenant.getDate() - day + (day == 0 ? -6:1); Utilisé pour semaine à semaine
		diff = dateMaintenant.getDate()

		calculeDates(0, new Date(dateAvant.setDate(diff - nbJoursDecalage)));			
		calculeDates(1, new Date(dateMaintenant.setDate(diff)));
		calculeDates(2, new Date(dateApres.setDate(diff + nbJoursDecalage)));
	}

 	les_services_dates.metAJourBufferDates = function(decalage){
		if (decalage == "shiftRight"){
			angular.copy(tableau_des_dates[1],tableau_des_dates[0]) ;
			angular.copy(tableau_des_dates[2],tableau_des_dates[1]) ;			
			var d = new Date(tableau_des_dates[2][0]);
			calculeDates(2, new Date(d.setDate(d.getDate() + nbJoursDecalage)));	
		}
		else 
		if (decalage == "shiftLeft"){
			angular.copy(tableau_des_dates[1],tableau_des_dates[2]) ;
			angular.copy(tableau_des_dates[0],tableau_des_dates[1]) ;				
			var d = new Date(tableau_des_dates[0][0]);
			calculeDates(0, new Date(d.setDate(d.getDate() - nbJoursDecalage)));	

		}
	
}
	return les_services_dates;
}]);






module_defileur.factory('gestionDesPanneaux',['$q', function($q){
var gestion_des_panneaux = {};

	var animation_en_cours = false;	
	var t_rightShift  = [1, 2, 0];
	var t_leftShift   = [2, 0, 1];


	//Publiques, car doivent être accessibles de l'extérieur par angularjs//
	gestion_des_panneaux.champ_gauche = 0, gestion_des_panneaux.champ_centre = 1, gestion_des_panneaux.champ_droite = 2;



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
					//serviceDates.metAJourBufferDates("shiftRight");
		
					gestion_des_panneaux.champ_gauche = t_leftShift[gestion_des_panneaux.champ_gauche];
					gestion_des_panneaux.champ_centre = t_leftShift[gestion_des_panneaux.champ_centre];
					gestion_des_panneaux.champ_droite = t_leftShift[gestion_des_panneaux.champ_droite];
			
					scope.$apply();
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
					//serviceDates.metAJourBufferDates("shiftLeft");

					gestion_des_panneaux.champ_gauche = t_rightShift[gestion_des_panneaux.champ_gauche];
					gestion_des_panneaux.champ_centre = t_rightShift[gestion_des_panneaux.champ_centre];
					gestion_des_panneaux.champ_droite = t_rightShift[gestion_des_panneaux.champ_droite];					 				
		
					scope.$apply();
					$(this).dequeue();	 				
	 			})
	 			.queue(function(){
					$(".rightPanel").css("left", "-100%");

					var centre = $(".centerPanel"), droite = $(".rightPanel"), gauche = $(".leftPanel");	
		
					centre.removeClass("centerPanel");
					//centre.removeClass("panneauActif");
					droite.removeClass("rightPanel").addClass("leftPanel");
					gauche.removeClass("leftPanel").addClass("centerPanel");
					//gauche.addClass("panneauActif");						
					centre.addClass("rightPanel");

					animation_en_cours = false ;		
					$(this).dequeue();
				});
			}
	}

	return gestion_des_panneaux;
}]);





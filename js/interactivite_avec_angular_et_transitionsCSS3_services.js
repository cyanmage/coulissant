var appli = angular.module('appli', ['defileur', 'fonctionsCourantes']);
var module_defileur = angular.module('defileur', []);

appli.config(['$interpolateProvider', function($interpolateProvider) {

  	$interpolateProvider.startSymbol('{{');
  	$interpolateProvider.endSymbol('}}');    
       }
]);






/*/////////////////////////////////////////////////////////////////////////////////*/
///////////////////////////////////////////////////////////////////////////////////*/
/*                                                                                 */
/*                                                                                 */
/*                    Controleur associé au défileur                               */
/*                                                                                 */
/*                                                                                 */
///////////////////////////////////////////////////////////////////////////////////*/
/////////////////////////////////////////////////////////////////////////////////////



module_defileur.controller("controleurDefileur", ['$q', 'gestionDesPanneaux', '$scope', 'servicesEvenements',
	function($q, gestionDesPanneaux, $scope, servicesEvenements){

 	$scope.gestionDesPanneaux = gestionDesPanneaux;
 	$scope.servicesEvenements = servicesEvenements;
	$scope.methode = "services"; 	


	/*$scope.$on("IChangedDirection", function(event, data){
		//console.log(data);
		$scope.$broadcast("signaleChangementDirection", data);
	});
	$scope.direction = "aucune";*/

	/*$scope.$watch("direction", function(){
		console.log("test scope dans le controleur" + $scope.direction);
	}) ;*/

}]);



/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/

//													  DIRECTIVES

/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/


module_defileur.directive('defileur', ['$q','gestionDesPanneaux', 'fonctionsCourantes', function($q, panneaux, fonctionsCourantes){
 	return {
 		restrict: 'AE',
 		scope : {
 			methode : "="
 		},
 		link : function(scope, element, attributes){
 			//transitionEnd  =  fonctionsCourantes.getVendorTransitionEnd();
 			//console.log(transitionEnd);	
 		}

	}
}]);


module_defileur.directive('directionDroite', ['gestionDesPanneaux',  'fonctionsCourantes', 'servicesEvenements',  
	function(panneaux, fonctionsCourantes, servicesEvenements ){

	return {
		restrict : 'AE',
		transclude : true,
		template : '<div ng-transclude></div>',

		link : function(scope, element, attributes) {

			element.on("click", function(event){
				if (servicesEvenements.mouvement == ""){
					servicesEvenements.mouvement = "droite";	
					scope.$apply();
				}
			});	
		}	

	}

}]);

module_defileur.directive('directionGauche', ['gestionDesPanneaux',  'fonctionsCourantes', 'servicesEvenements', 
	function(panneaux, fonctionsCourantes, servicesEvenements ){

	return {
		restrict : 'AE',
		transclude : true,
		template : '<div ng-transclude></div>',
	
		link : function(scope, element, attributes) {

			element.on("click", function(event){
				if (servicesEvenements.mouvement == ""){
					servicesEvenements.mouvement = "gauche";	
					scope.$apply();					
				}
			});	

		}	

	}

}]);



module_defileur.directive('panneauDefileur', ['gestionDesPanneaux', 'servicesEvenements', 
	function(panneaux, servicesEvenements){


	return {
		restrict : 'AE',
		transclude : true,	
		template : '<div class = "panneau" ng-transclude></div>', 
		replace : true, 
		scope : {},
		link : function(scope, element, attributes){

			scope.servicesEvenements = servicesEvenements;	
			scope.$watch('servicesEvenements.mouvement', function(newValue, oldValue, scope) {

				if(newValue !== oldValue && newValue !== ""){
					console.log("je commence à défiler ! nouvelle valeur : " + newValue + ", ancienne valeur : " + oldValue);					
					servicesEvenements.mouvement == 'gauche'  ? panneaux.permuteGauche(element) : panneaux.permuteDroite(element);	
				}
			});	

			element.on("transitionend", function(event, data){
							if(element.attr("emplacement") == "centre"){
								servicesEvenements.mouvement = "";
								scope.$apply();
								}						
							event.stopPropagation();
								
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


module_defileur.factory('servicesEvenements', ['$q', function($q){
	var les_services_evenements = {};

	les_services_evenements.mouvement = "";


	return les_services_evenements;
}]);








module_defileur.factory('gestionDesPanneaux',['$q', function($q){
	var gestion_des_panneaux = {};

	var animation_en_cours = false;	


	gestion_des_panneaux.permuteDroite = function(element){
		var emplacement = element.attr('emplacement');		
		if (emplacement == "gauche"){
			element.addClass("noTransition");
			element.attr("emplacement", "droite");
			element.height();  // hack : indispensable pour forcer le reflow et que la transition "noTransition" soit appliquée ! 
			element.removeClass("noTransition");					
		}
		else if(emplacement == "centre")
			element.attr("emplacement", "gauche");
		else if (emplacement == "droite")
			element.attr("emplacement", "centre");
	}		

	gestion_des_panneaux.permuteGauche = function(element){
		var emplacement = element.attr('emplacement');			
		if (emplacement == "droite"){
			element.addClass("noTransition");
			element.attr("emplacement", "gauche");
			element.height();  // hack : indispensable pour forcer le reflow et que la transition "noTransition" soit appliquée ! 
			element.removeClass("noTransition");								
		}
		else if(emplacement == "centre")
			element.attr("emplacement", "droite");
		else if (emplacement == "gauche")
			element.attr("emplacement", "centre");
	}		

	gestion_des_panneaux.finDefilement = function(scope, element){
		if(element.attr("emplacement") == "centre")
			scope.$emit("transitionPanneauTerminee");
	}


	return gestion_des_panneaux;
}]);






var module_fonctions_courantes = angular.module('fonctionsCourantes', []);

module_fonctions_courantes.factory('fonctionsCourantes', function(){


	var fonctions_courantes = {};
	var transitionEnd = whichTransitionEvent();
	//console.log(transitionEnd);



	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition':'transitionend',
	      'OTransition':'oTransitionEnd',
	      'MozTransition':'transitionend',
	      'WebkitTransition':'webkitTransitionEnd'
	    }
	
	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}

	fonctions_courantes.getVendorTransitionEnd = function(){
		return transitionEnd;
	}
	
	return fonctions_courantes;
});


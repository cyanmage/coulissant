var appli = angular.module('appli', ['defileur']);
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


module_defileur.controller("controleurDefileur", ['$scope', '$q', 
	function($scope, $q){
		
	$scope.modeDefilement = "";
	$scope.direction = "" ;	

	$scope.$watch("direction", function(newValue, oldValue, scope){
		//console.log(scope.direction);
			$scope.modeDefilement = $scope.direction;
	});

	$scope.$watch("modeDefilement", function(newValue, oldValue, scope){
		if (newValue !== oldValue && newValue === "defilementTermine"){
			console.log($scope.modeDefilement);
			$scope.direction = "";	
		}
	});

}]);


module_defileur.controller("controleurPanneau", ['$scope', '$q', 
	function($scope, $q){

	$scope.enCours = "on essaie !";
	//$scope.modeDefilement = "vrouuuum !";

}]);

/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/

//													  DIRECTIVES

/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/
/*#############################             ###############################          ################################*/


module_defileur.directive('defileur', ['$q', function($q){
 	return {
 		restrict: 'AE',
 		link : function(scope, element, attributes){
 		scope : {

 			}		
 		}
	}
}]);


//console.log();


module_defileur.directive('panneauDefileur', ['gestionDesPanneaux', '$timeout', function(panneaux, $timeout){

	return {
		restrict : 'AE',
		transclude : true,
		template : '<div class = "panneau" mode="modeDefilement"><div ng-transclude></div><div>Mode defilemnt : {{modeDefilement}}</div></div>', 
		replace : true, 
		/*scope : {
			mode : " = "
		},*/
		controller : "controleurPanneau",
		link : function(scope, element, attributes){

			element.on("transitionend", function(event, data){
				if(element.attr("emplacement") == "centre"){
					scope.$apply(scope.modeDefilement = "defilementTermine");
				}
				event.stopPropagation();
			});

			scope.$watch("modeDefilement", function(newValue, oldValue, scope){
				console.log(scope.modeDefilement);
				if (scope.modeDefilement == "gauche"){
					panneaux.permuteDroite(element);
					if (element.attr("emplacement") == "droite"){

						/*scope.enCours = " je fais quelque chose :)"
						$timeout(function(){
							scope.$apply(scope.enCours = "");
							console.log("fini de charger !!");
						}, 500);*/
					}
				}
				else if (scope.modeDefilement == "droite"){
					panneaux.permuteGauche(element);
						if (element.attr("emplacement") == "gauche"){

						/*scope.enCours = " je fais quelque chose :)";
						$timeout(function(){
							scope.$apply(scope.enCours = "");
							console.log("fini de charger !!");							
						}, 500);*/
					}
				}
			});

		}

	}

}]);



module_defileur.directive('directionDroite', function(){

	return {
		restrict : 'AE',
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				if (!scope.direction)
					scope.$apply(scope.direction = "gauche");
			});	
		}	
	}

});


module_defileur.directive('directionGauche', function(){

	return {
		restrict : 'AE',
		link : function(scope, element, attributes) {
			element.on("click", function(event){
				if (!scope.direction)
					scope.$apply(scope.direction = "droite");
			});	
		}	
	}

});


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************            LES SERVICES         ***************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

module_defileur.factory('gestionDesPanneaux',['$q', function($q){
	var gestion_des_panneaux = {};

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

	return gestion_des_panneaux;
}]);



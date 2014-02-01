<?php
class Sedo_GoToTop_Listener_Templates
{
	public static function goToTop(&$templateName, array &$params, XenForo_Template_Abstract $template)
	{
		switch ($templateName) {
			case 'PAGE_CONTAINER':
				//Init
				$visitor = XenForo_Visitor::getInstance();
				$GttBrowser = '';
				
	
	      			// Type: Normal/Mini/(None)
	      			$GttType = XenForo_Template_Helper_Core::styleProperty('gototopType');				
	      			$typeMobile = XenForo_Template_Helper_Core::styleProperty('gototopTypeMobile');
	      			$typeTablet = XenForo_Template_Helper_Core::styleProperty('gototopTypeTablet');	
	
	  			//External Addon
	      			if( class_exists('Sedo_DetectBrowser_Listener_Visitor') && isset($visitor->getBrowser))
	      			{
					//Check if mobile and not tablet
	      				if($visitor->getBrowser['isMobile'] && !$visitor->getBrowser['isTablet'] )
	      				{
	      					if($typeMobile == 'none')
	      					{
	      						break;
	      					}
	      					
	      					$GttType = $typeMobile;
	      				}
	      				
					//Check if tablet     				
	      				if( $visitor->getBrowser['isTablet'] )
	      				{
	      					 if( in_array($typeTablet, array('none', 'error')) )
	      					 {
	      					 	break;
	      					 }
	
	      					$GttType = $typeTablet;
	      				}
	
					//Check if IE6
					if($visitor->getBrowser['IEis'] == 6)
	        			{
	  	      				$GttBrowser = 'IE';      			
	        			}
	      			}
	      			else
	      			{
	      				//XenForo Mobile
	      				if(XenForo_Visitor::isBrowsingWith('mobile'))
	      				{
	      					if($typeMobile == 'none')
	      					{
	      						break;
	      					}
	
	      					$GttType = $typeMobile;
	      				}
					
					//IE6 self function
		      			$checkIE6 = self::isBadIE('target', '1-6');				
	
		      			if($checkIE6 === true)
		      			{
		      				$GttBrowser = 'IE';
		      			}
	      			}

				$extraParams['goToTop'] = array(
					'type' => $GttType,
					'browser' => $GttBrowser
				);
	      
	      			$params += $extraParams;
			break;
		}
	}
	
	
	/******
		#isBadIE

		If no option => return true from IE1 to IE8
		#option: all => return true for all IE
		#target + RANGE; ex: isBadIE('target', '6-7') => return true if match the target
	***/

	public static function isBadIE($method = false, $range = false)
	{
		if(!isset($_SERVER['HTTP_USER_AGENT']))
		{
			return false;
		}

		$useragent = $_SERVER['HTTP_USER_AGENT'];
		$output = false;

		if(preg_match('/(?i)msie/', $useragent))
       		{
			if($method == 'all')
			{
	       			$output = true;
	       		}
	       		elseif($method == 'target')
	       		{
	       			preg_match('#^(\d+?)-(\d+?)$#', $range, $match);
	       			$first = $match[1];
	       			$last = $match[2];
	       			$first_fix = $first - 4;
	       			$last_fix = $last - 4;
	       			
	       			if($first > 7 AND $last > 7)
	       			{
		       			if(preg_match('/(?i)Trident\/[' . $first_fix  . '-' . $last_fix  . ']/', $useragent))
       					{
      						$output = true;
	       				}	       			
	       			}
	       			elseif($first < 8 AND $last > 7)
	       			{
		       			if(preg_match('/(?i)Trident\/[4-' . $last_fix  . ']/', $useragent) OR preg_match('/(?i)msie [' . $first . '-7]/', $useragent))
       					{
      						$output = true;
	       				}	       			
	       			}
	       			elseif($last < 8)
	       			{
		       			if(preg_match('/(?i)msie [' . $first . '-' . $last . ']/', $useragent))
       					{
      						$output = true;
	       				}	       			
	       			}
	       		}
	       		else
	       		{
	       			if(preg_match('/(?i)Trident\/4/', $useragent) OR preg_match('/(?i)msie [1-7]/', $useragent))
       				{
       					//IE1 to IE8 width default option
      					$output = true;
	       			}
	       		}
       		}

       		return $output;
	}
}
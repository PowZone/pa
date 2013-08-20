/*!
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2003 - 2013, EllisLab, Inc.
 * @license		http://ellislab.com/expressionengine/user-guide/license.html
 * @link		http://ellislab.com
 * @since		Version 2.0
 * @filesource
 */

function _access_edit_ajax(a,b,g,c){var i="";switch(c){case "no_auth_bounce":i=jQuery.param({template_id:b,no_auth_bounce:a.val()});break;case "enable_http_auth":i=jQuery.param({template_id:b,enable_http_auth:a.val()});break;case "access":c=!$(a).closest(".accessTable").length?$(".no_auth_bounce").val():$(a).closest(".accessTable").find(".no_auth_bounce").val(),i=jQuery.param({template_id:b,member_group_id:g,new_status:a.val(),no_auth_bounce:c})}$.ajax({type:"POST",url:EE.access_edit_url,data:"is_ajax=TRUE&XID="+
EE.XID+"&"+i,success:function(a){""!==a&&$.ee_notice(a,{duration:3E3,type:"success"})},error:function(a){""!==a.responseText&&$.ee_notice(a.responseText,{duration:3E3,type:"error"})}})}function refresh_prefs_ajax(a){$.ajax({type:"GET",url:EE.template_prefs_url,data:"is_ajax=TRUE&group_id="+a,dataType:"json",success:function(a){EE.pref_json=a}})}
function access_edit_ajax(a){var b,g;"no_auth_bounce"===a.attr("name").substr(0,14)?(g=a.attr("name").substr(15)?a.attr("name").substr(15):$("input:hidden[name=template_id]").val(),_access_edit_ajax(a,g,"","no_auth_bounce")):"enable_http_auth"===a.attr("name").substr(0,16)?(g=a.attr("name").substr(17)?a.attr("name").substr(17):$("input:hidden[name=template_id]").val(),_access_edit_ajax(a,g,"","enable_http_auth")):(b=a.attr("name").replace("access_","").split("_"),g=2>b.length?$("input:hidden[name=template_id]").val():
b[1],_access_edit_ajax(a,g,b[0],"access"))}
function template_edit_ajax(){var a=$(this).closest(".accessRowHeader"),b,g,c,i,l,d,j,k,f,m;1>a.length&&(a=$(this).closest(".templateEditorTable"));b=a.data("ajax_ids");if(!b)return $(this).hasClass("ignore_radio")?!1:access_edit_ajax($(this));g=b.id;b=b.group_id;c=a.find(".template_name").val();i=a.find("select[name^=template_type]").val();l=a.find("select[name^=cache]").val();d=a.find(".refresh").val();j=a.find("select[name^=allow_php]").val();k=a.find("select[name^=php_parse_location]").val();f=
a.find(".hits").val();m=a.find(".template_size").val();a=jQuery.param({template_id:g,group_id:b,template_name:c,template_type:i,cache:l,refresh:d,hits:f,allow_php:j,php_parse_location:k,template_size:m});$.ajax({type:"POST",url:EE.template_edit_url,data:"is_ajax=TRUE&XID="+EE.XID+"&"+a,success:function(a){var e=$("#templateId_"+g);e.text(c);if(e.closest(".templateName").length){if(e=e.closest(".templateName").next().find("a"),e.length)e=e.get(0),e.href=e.href.replace(/\/[^\/]*$/,"/"+c)}else if($("#templateViewLink a.submit").length&&
(e=$("#templateViewLink a.submit"),e.length))e=e.get(0),e.href=e.href.replace(/\/[^\/]*$/,"/"+c);$("#template_data").attr("rows",m);$("#hitsId_"+g).text(f);""!==a&&$.ee_notice(a,{duration:3E3,type:"success"})},error:function(a){""!==a.responseText&&$.ee_notice(a.responseText,{duration:3E3,type:"error"})}})}function hideSubRows(a,b){b?$(a).data(b)&&$(a).data(b).hide():(hideSubRows(a,"prefsRow"),hideSubRows(a,"accessRow"))}
function hideRow(a,b){a.hasClass("highlightRow")&&a.removeClass("highlightRow");if(a.data(b)){var g=a.data(b).is(":visible");hideSubRows(a);g||(a.addClass("highlightRow"),a.data(b).show());return!0}hideSubRows(a);return!1}function set_radio_buttons(a,b){a.find("input:radio").each(function(){var a,c;a=$(this).attr("id").split("_");c=a.slice(0,-1).join("_");a=a.slice(-1)[0];$(this).attr({id:c+"_"+b+"_"+a,name:c+"_"+b})})}
function bind_prefs_events(){$(".templateTable .accessTable").find("input:text").unbind("blur.manager_updated").bind("blur.manager_updated",template_edit_ajax);$(".templateTable .accessTable").find("input:radio").unbind("click.manager_updated").bind("click.manager_updated",template_edit_ajax);$(".templateTable .accessTable").find("select").unbind("change.manager_updated").bind("change.manager_updated",template_edit_ajax)}
(function(a){var b,g;a(document).ready(function(){function c(f,b){var d="input:radio[id$=_";b&&(d="input:radio[id$=_"+b+"_");f.find(".ignore_radio").click(function(){"y"===this.value&&f.find(d+"y]").filter(":not(.ignore_radio)").trigger("click");"n"===this.value&&f.find(d+"n]").filter(":not(.ignore_radio)").trigger("click");a(this).attr("checked",!1);return!1})}function i(f,d,b){var e=a('<tr class="accessRowHeader"><td colspan="6">'+g+"</td></tr>");e.find(".no_auth_bounce").val(b.no_auth_bounce);
e.find(".no_auth_bounce").attr({id:"no_auth_bounce_"+f,name:"no_auth_bounce_"+f});e.find(".enable_http_auth").val(b.enable_http_auth);e.find(".enable_http_auth").attr({id:"enable_http_auth_"+f,name:"enable_http_auth_"+f});set_radio_buttons(e,f);a.each(b.access,function(a,d){var b=e.find("#access_"+a+"_"+f+"_y"),c=e.find("#access_"+a+"_"+f+"_n");!0===d.access?(b.attr("checked","checked"),c.attr("checked",!1)):(c.attr("checked","checked"),b.attr("checked",!1))});c(e,f);a(d).addClass("highlightRow");
a(d).after(e);e.find(".accessTable").tablesorter({widgets:["zebra"]});d.data("accessRow",e)}function l(d,c){var h=a('<tr class="accessRowHeader"><td colspan="6">'+b+"</td></tr>");h.find("select").each(function(){var d=a(this);switch(this.name){case "template_type":d.val(c.type);break;case "cache":d.val(c.cache);break;case "allow_php":d.val(c.allow_php);break;case "php_parse_location":d.val(c.php_parsing)}d.attr("name",this.name+"_"+c.id)});h.find(".template_name").val(c.name);"index"===c.name&&h.find(".template_name").attr({readonly:"readonly"});
h.find(".refresh").val(c.refresh);h.find(".hits").val(c.hits);h.data("ajax_ids",{id:c.id,group_id:c.group_id});d.data("prefsRow",h);a(d).addClass("highlightRow");a(d).after(h)}var d,j,k;b=a("#prefRowTemplate").html();g=a("#accessRowTemplate").html();!b||!g?(d=a("#templateAccess, #templatePreferences"),j=a("input:hidden[name=template_id]").val(),k=a("input:hidden[name=group_id]").val(),a("#templatePreferences").data("ajax_ids",{id:j,group_id:k}),c(a("#templateAccess")),d.find("input:text").unbind("blur.manager_updated").bind("blur.manager_updated",
template_edit_ajax),d.find("input:radio").unbind("click.manager_updated").bind("click.manager_updated",template_edit_ajax),d.find("select").unbind("change.manager_updated").bind("change.manager_updated",template_edit_ajax)):(a("#prefRowTemplate, #accessRowTemplate").remove(),EE.manager={refreshPrefs:function(a){refresh_prefs_ajax(a)},showPrefsRow:function(d,b){var c=a(b).parent().parent();hideRow(c,"prefsRow")||(l(c,d),bind_prefs_events());return!1},showAccessRow:function(d,b,c){c=a(c).parent().parent();
hideRow(c,"accessRow")||(i(d,c,b),bind_prefs_events(),c.trigger("applyWidgets"));return!1}})});a(".last_edit").css("opacity",0).show();a("#template_details").hover(function(){a(".last_edit").animate({opacity:1},50)},function(){a(".last_edit").animate({opacity:0},50)});a(document).ready(function(){if(EE.manager&&EE.manager.warnings){a(".warning_details").hide();a(".toggle_warning_details").click(function(){a(".warning_details").hide();a("#wd_"+this.id.substr(3)).show();return!1});var c=a("#template_data"),
b,g;g=function(d,b,c){var f="";c&&1<c.length&&(f='<select name="fr_options" id="fr_options"></select>');a.ee_notice('<div style="padding: 5px;"><label>Find:</label> <input name="fr_find" id="fr_find" type="text" value="" /> <label>Replace:</label> <input type="text" name="fr_replace" id="fr_replace" value=""/> '+f+'</div><div style="padding: 5px;"><button class="submit" id="fr_find_btn">Find Next</button> <button class="submit" id="fr_replace_btn">Replace</button> <button class="submit" id="fr_replace_all_btn">Replace All</button> <label><input name="fr_replace_closing_tags" id="fr_replace_closing_tags" type="checkbox" /> Include Closing Tags</label></div>',
{type:"custom",open:!0,close_on_click:!1});a("#fr_find").val(d);a("#fr_replace").val(b);a("#fr_replace_closing_tags").attr("checked",!1);""!==f&&(a("#fr_options").append(a(c)),a("#fr_options").click(function(){a("#fr_find").val(a(this).val());a("#fr_find_btn").click()}));d&&a("#fr_find_btn").click()};a("#fr_find_btn").live("click",function(){var d=a("#fr_find").val();b=c.selectNext(d).scrollToCursor()});a("#fr_replace_btn").live("click",function(){var d=a("#fr_find").val(),c=a("#fr_replace").val();
b.getSelectedText()===d&&b.replaceWith(c)});a("#fr_replace_all_btn").live("click",function(){var d=a("#fr_find").val(),b=a("#fr_replace").val();""!==jQuery.trim(d)&&(c.val(c.val().split(d).join(b)),a("#fr_replace_closing_tags").attr("checked")&&("{"===d[0]&&"{/"!==d.substr(0,2)&&(d="{/"+d.substr(1)),"{"===b[0]&&"{/"!==b.substr(0,2)&&(b="{/"+b.substr(1)),""!==jQuery.trim(d)&&c.val(c.val().split(d).join(b))))});a(".find_and_replace").click(function(){var a=this.id.substr(8),b="{exp:"+a,c="{exp:"+EE.manager.warnings[a].suggestion,
f=EE.manager.warnings[a].full_tags,i=Array(new Option(b,b)),h;if(f&&1<f.length)for(h=0;h<f.length;h++)a="{"+f[h]+"}",i.push(new Option(a,a));"{exp:"===c&&(c="");g(b,c,i);return!1})}});a("#template_keywords_reset").click(function(){a("#template_keywords").val("");a(".search form").submit()})})(jQuery);

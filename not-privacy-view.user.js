// ==UserScript==
// @id             iitc-plugin-not-privacy-view@Jormund
// @name           IITC plugin: Not Privacy view
// @version        1.0.1.20161003.4740
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [iitc-2016-10-03-004740] Hide info from intel which shouldn't leak to players of the other faction.
// @downloadURL    https://github.com/Jormund/not-privacy-view/raw/master/not-privacy-view.user.js
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==
//replace privacyView by notPrivacyView
//replace privacy_ by not_privacy_
//replace privacycontrols by notprivacycontrols
//remove plugin_info

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () { };

    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.notPrivacyView = function () { };

    window.plugin.notPrivacyView.chatExpanded = function () {
        return $('#chat, #chatcontrols').hasClass('expand');
    };

    window.plugin.notPrivacyView.toggle = function () {
        if ($('#chat').hasClass('expand')) window.plugin.notPrivacyView.wrapChatToggle();

        var b = $('body');
        var t = $('#notprivacycontrols .toggle');
        if (b.hasClass('not_privacy_active')) {
            b.removeClass('not_privacy_active').addClass('not_privacy_inactive');
            t.text('Privacy inactive');
        } else {
            b.removeClass('not_privacy_inactive').addClass('not_privacy_active');
            t.text('Privacy active');
            if (window.plugin.notPrivacyView.chatExpanded()) {
                window.plugin.notPrivacyView.wrapChatToggle();
            }
        }
    };

    window.plugin.notPrivacyView.wrapChatToggle = function () {
        if ($(document.body).hasClass('not_privacy_active')) return;

        window.chat.toggle();
        var c = $('#chat, #chatcontrols');
        if (c.hasClass('expand')) {
            $('#notprivacycontrols').removeClass('shrinked').addClass('expanded');
        } else {
            $('#notprivacycontrols').removeClass('expanded').addClass('shrinked');
        }
    };

    window.plugin.notPrivacyView.setup = function () {
        var not_privacy_button_width = 135;
        $('head').append('<style>' +
    '.not_privacy_active #playerstat,' +
    '.not_privacy_active #chatinput,' +
    '.not_privacy_active #chatcontrols,' +
    '.not_privacy_active #chat { display: none; }' +
    '#notprivacycontrols {' +
    '  color: #FFCE00;' +
    '  background: rgba(8, 48, 78, 0.9);' +
    '  position: absolute;' +
    '  left: 0;' +
    '  z-index: 3001;' +
    '  height: 26px;' +
    '  padding-left:1px;' +
    '  bottom: 82px;' +
    '}' +
    '#notprivacycontrols a {' +
    '  margin-left: -1px;' +
    '  display: inline-block;' +
    '  width: ' + not_privacy_button_width + 'px;' +
    '  text-align: center;' +
    '  height: 24px;' +
    '  line-height: 24px;' +
    '  border: 1px solid #20A8B1;' +
    '  vertical-align: top;' +
    '}' +
    '#notprivacycontrols a {' +
    '  text-decoration: none !important;' +
    '}' +
    '#notprivacycontrols .toggle {' +
    '  border-left: 10px solid transparent;' +
    '  border-right: 10px solid transparent;' +
    '  width: auto;' +
    '}' +
    '#chatcontrols {' +
    '  left: ' + (not_privacy_button_width + 1) + 'px;' +
    '}' +
    '#notprivacycontrols.expanded { top: 0; bottom: auto; }' +
    '#notprivacycontrols.shrinked { bottom: 82px; }' +
    '.not_privacy_active #notprivacycontrols { bottom: 0; }' +
    '</style>');

        $('body').addClass('not_privacy_inactive');

        //Wrap iitc chat toggle to update our elements
        $('#chatcontrols a:first').unbind('click');
        $('#chatcontrols a:first').click(window.plugin.notPrivacyView.wrapChatToggle);

        $('#chatcontrols').before('<div id="notprivacycontrols" class="shrinked">' +
    '  <a accesskey="9" title="[9]"><span class="toggle"></span></a>' +
    '</div>');
        $('#notprivacycontrols a').click(window.plugin.notPrivacyView.toggle);

        window.plugin.notPrivacyView.toggle();
    };

    var setup = window.plugin.notPrivacyView.setup;

    // PLUGIN END //////////////////////////////////////////////////////////


    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);



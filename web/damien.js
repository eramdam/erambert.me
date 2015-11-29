WebFontConfig = {
google: { families: [ 'PT+Sans:400,700,400italic,700italic' , 'Gentium+Book+Basic:400,700,700italic,400italic' ] }
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();

emoji.img_set = 'apple';
var emojis = [].slice.call(document.querySelectorAll(".emoji-filled"));

for (var i = emojis.length - 1; i >= 0; i--) {
  // console.log(emojis[i].innerHTML);
  emojis[i].innerHTML = emoji.replace_unified(emojis[i].innerHTML);
  // emojis[i].innerHTML = emoji.replace_colons(emojis[i].innerHTML);
}
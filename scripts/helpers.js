var links = {
  index: 'https://github.com/tommy351/hexo',
  warehouse: 'https://github.com/tommy351/warehouse'
};

var getCorrectRelativeUrl = function(address) {
  return address.substr( 0, 1 ) !== "/" ? "/" + address + "/" : address;
}

hexo.extend.helper.register('github_link', function(data){
  var match = data.file.match(/(\w+)\/lib\/(.+)/),
    name = match[1],
    path = 'lib/' + match[2];

  if (name === 'hexo') name = 'index';

  var line = data.line,
    version = this.site.yuidoc.findByName(name).project.version || 'master';

  return '<a href="' + links[name] + '/blob/' + version + '/' + path + '#L' + line + '">' + path + ':' + line + '</a>';
});

hexo.extend.helper.register('item_flags', function(data){
  var result = '';

  ['static', 'chainable', 'async', 'final'].forEach(function(i){
    if (data[i]) result += '<span class="api-item-flag ' + i + '">' + i + '</span>';
  });

  return result;
});

hexo.extend.helper.register('edit_link', function(path){
  var root = "https://github.com/pagehop/api.pagehopapp.com/blob/master/source/";
  if ( path === "/index.html" ) {
    return root + "index.md";
  } else {
    return root + path.replace(/\/index\.html$/, '.md');
  }
});

hexo.extend.helper.register('page_nav', function(){
  var sidebar = this.theme.doc_sidebar,
    path = this.path.replace(/^([^\/]*)\/.*$/, '$1') || "/",
    list = {};

  for (var i in sidebar){
    for (var j in sidebar[i]){
      list[sidebar[i][j]] = j;
    }
  }

  var keys = Object.keys(list),
    index = keys.indexOf(path),
    result = [];

  if (index > 0){
    result.push('<a href="' + getCorrectRelativeUrl( keys[index - 1] ) + '" id="page-footer-prev" title="' + list[keys[index - 1]] + '">Prev</a>');
  }

  if (index < keys.length - 1){
    result.push('<a href="' + getCorrectRelativeUrl( keys[index + 1] ) + '" id="page-footer-next" title="' + list[keys[index + 1]] + '">Next</a>');
  }

  return result.join('');
});
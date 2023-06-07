function Sparkline(element, options = {}) {
  this.element = element;
  this.options = {
    width: 100,
    lineColor: "black",
    lineWidth: 1,
    startColor: "transparent",
    endColor: "red",
    maxColor: "transparent",
    minColor: "transparent",
    minValue: null,
    maxValue: null,
    dotRadius: 2.5,
    tooltip: null,
    ...options,
  }

  this.element.innerHTML = "<canvas></canvas>";
  this.canvas = this.element.firstChild;
  this.context = this.canvas.getContext("2d");
  this.ratio = window.devicePixelRatio || 1;
  
  if(this.options.tooltip){
      this.canvas.style.position = "relative";
      this.canvas.onmousemove = showTooltip.bind(this);
  }
}

Sparkline.init = function(element, options){
  return new Sparkline(element, options);
};

Sparkline.draw = function(element, points, options){
  var sparkline = new Sparkline(element, options);
  sparkline.draw(points);
  return sparkline;
}

function getY(minValue, maxValue, offsetY, height, index){
  var range = maxValue - minValue;
  if(range == 0){
    return offsetY + height/2;
  }else{
    return (offsetY + height) - ((this[index] - minValue) / range)*height;
  }
}

function drawDot(radius, color, x, y){
  this.beginPath();
  this.fillStyle = color;
  this.arc(x, y, radius, 0, Math.PI*2, false);
  this.fill();
}

function showTooltip(e){
  var x = e.offsetX || e.layerX || 0;
  var delta = ((this.options.width - this.options.dotRadius*2) / (this.points.length - 1));
  var index = minmax(0, Math.round((x - this.options.dotRadius)/delta), this.points.length - 1);
  
  this.canvas.title = this.options.tooltip(this.points[index], index, this.points);
}

Sparkline.prototype.draw = function(points){

  points = points || [];
  this.points = points;
  
  this.canvas.width = this.options.width * this.ratio;
  this.canvas.height = this.element.offsetHeight * this.ratio;
  this.canvas.style.width = this.options.width + 'px';
  this.canvas.style.height = this.element.offsetHeight + 'px';

  var offsetX = this.options.dotRadius*this.ratio;
  var offsetY = this.options.dotRadius*this.ratio;
  var width = this.canvas.width - offsetX*2;
  var height = this.canvas.height - offsetY*2;

  var minValue = this.options.minValue || Math.min.apply(Math, points);
  var maxValue = this.options.maxValue || Math.max.apply(Math, points);
  var minX = offsetX;
  var maxX = offsetX;

  var x = offsetX;
  var y = getY.bind(points, minValue, maxValue, offsetY, height);
  var delta = width / (points.length - 1);

  var dot = drawDot.bind(this.context, this.options.dotRadius*this.ratio);


  this.context.beginPath();
  this.context.strokeStyle = this.options.lineColor;
  this.context.lineWidth = this.options.lineWidth*this.ratio;

  this.context.moveTo(x, y(0));
  for(var i=1; i<points.length; i++){
      x += delta;
      this.context.lineTo(x, y(i));

      minX = points[i] == minValue ? x : minX;
      maxX = points[i] == maxValue ? x : maxX;
  }
  this.context.stroke();

  dot(this.options.startColor, offsetX + (points.length == 1 ? width/2 : 0), y(0));
  dot(this.options.endColor, offsetX + (points.length == 1 ? width/2 : width), y(i - 1));
  dot(this.options.minColor, minX + (points.length == 1 ? width/2 : 0), y(points.indexOf(minValue)));
  dot(this.options.maxColor, maxX + (points.length == 1 ? width/2 : 0), y(points.indexOf(maxValue)));
}

function minmax(a, b, c){
  return Math.max(a, Math.min(b, c));
}

const performance = document.getElementById('performance')

function loadPerformance () {
  const likes = []
  const retweets = []
  const replies = []
  const sortedCsv = csv.sort((a, b) => a[0] - b[0])

  // @TODO: Literally fight me about this, please, fr fr
  const weights = {
    likes: 1,
    retweets: 1,
    replies: 1,
  };

  let highestLike = 0
  let highestRetweet = 0
  let highestReply = 0
  let highestEngagement = 0

  const chartOptions = {
    lineColor: "#666",
    maxColor: "green",
    minColor: "red",
    dotRadius: 3,
    width: 500,
    tooltip: function(value, index, collection) {
      return sortedCsv[index][0].toISOString()
    }
  }

  const likeChart = new Sparkline(document.getElementById('likeChart'), chartOptions)
  const retweetChart = new Sparkline(document.getElementById('retweetChart'), chartOptions)
  const replyChart = new Sparkline(document.getElementById('replyChart'), chartOptions)
  const engagementChart = new Sparkline(document.getElementById('engagementChart'), chartOptions)

  sortedCsv.forEach(line => {
    if (line === undefined) {
      return
    }

    const [ createdAt, tweet, replyCount, retweetCount, likeCount ] = line

    replies.push(replyCount)
    if (replyCount > highestReply) {
      highestReply = replyCount
    }

    retweets.push(retweetCount)
    if (retweetCount > highestRetweet) {
      highestRetweet = retweetCount
    }

    likes.push(likeCount)
    if (likeCount > highestLike) {
      highestLike = likeCount
    }
  })

  const engagementRatio = sortedCsv.map(line => {
    if (line === undefined) {
      return 0
    }

    const [ createdAt, tweet, replyCount, retweetCount, likeCount ] = line

    const compositeScore = replyCount > 0 && likeCount === 0
      ? 1
      : replyCount === 0 && likeCount === 0
        ? 0
        : replyCount / likeCount

    if (compositeScore > highestEngagement) {
      highestEngagement = compositeScore
    }

    return compositeScore
  })

  document.getElementById('highestLikes').innerHTML = highestLike
  document.getElementById('highestRetweets').innerHTML = highestRetweet
  document.getElementById('highestReplies').innerHTML = highestReply
  document.getElementById('highestEngagement').innerHTML = (highestEngagement * 100).toFixed(2) + '%'

  likeChart.draw(likes)
  retweetChart.draw(retweets)
  replyChart.draw(replies)
  engagementChart.draw(engagementRatio)
}
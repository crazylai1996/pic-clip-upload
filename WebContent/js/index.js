// JavaScript Document
$(function(){
	var srcInput=$("#src-img-input");
	var container=$(".clip-container");
	var clipContents="<div class='clip-box'>"+
	"<div class='selected-part'></div>"+
	"<img class='src-image'/></div>"+
	"<button class='clip-btn'>裁剪</button>";
	srcInput.change(function(){
		container.html(clipContents);
		var clipObj=$.clipObj();
		var reader=new FileReader();
		reader.readAsDataURL(this.files[0]);
		reader.onload=function(){
			clipObj.srcImage.src=this.result;
			setTimeout(function(){
				clipObj.init();
			},100);
			reader=null;
		};
	});
	$.clipObj=function(){
		var clipBox=container.find(".clip-box");
		clipBox.srcImage=clipBox.find(".src-image")[0];
		clipBox.size={
			width:0,
			height:0
		};
		clipBox.selectedBox=(function(){
			var selectedBox=clipBox.find(".selected-part");
			selectedBox.position={
				left:0,
				top:0
			};
			selectedBox.size=0;
			selectedBox.setSize=function(size){
				this.css({
					width:size+"px",
					height:size+"px"
				});
				this.size=size;
			};
			selectedBox.move=function(offset){
				var offsetX=offset.x, 
				offsetY=offset.y,
				posLeft=this.position.left,
				posTop=this.position.top,
				size=this.size,
				width=clipBox.size.width,
				height=clipBox.size.height,
				left,top;
				if(size+posLeft+offsetX>width){
					left=width-size;
				}
				else{
					left=posLeft+offsetX;
				}
				if(size+posTop+offsetY>height){
					top=height-size;
				}
				else{
					top=posTop+offsetY;
				}
				left=left<0?0:left;
				top=top<0?0:top;
				this.css({
					left:left+"px",
					top:top+"px"
				});
				this.position={
					left:left,
					top:top
				};
			};
			(function(){
				selectedBox.lastPoint=null;
				function getOffset(event){
					var x,y;
					x=event.clientX;
					y=event.clientY;
					
					if(!selectedBox.lastPoint){
						selectedBox.lastPoint={
							x:x,
							y:y
						};
					}
					
					var offset={
						x:x-selectedBox.lastPoint.x,
						y:y-selectedBox.lastPoint.y
					};
					selectedBox.lastPoint={
						x:x,
						y:y
					};
					return offset;
				}
				selectedBox.on("mousedown",function(event){
					getOffset(event);
				});
				selectedBox.on("mousemove",function(event){
					if(!selectedBox.lastPoint){
						return;
					}
					var offset=getOffset(event);
					selectedBox.move(offset);
				});
				selectedBox.on("mouseup",function(){
					selectedBox.lastPoint=null;
				});
			})();
			return selectedBox;
		})();
		clipBox.init=function(){
			$(".target-image-container").html("");
			var width=this.width();
			var height=this.height();
			this.size={
				width:width,
				height:height
			};
			var size=width>height?height:width;
			this.selectedBox.setSize(size);
		};
		(function(){
			clipBox.clipImage=function(){
				var nw=this.srcImage.naturalWidth,
				nh=this.srcImage.naturalHeight,
				size=nw>nh?nh:nw;
				size=size>1000?1000:size;
				var canvas=$("<canvas class='target-image' width='"+size+"' height='"+size+" '></canvas>")[0],
				ctx=canvas.getContext("2d");
				var scale=nw/this.size.width,
				x=this.selectedBox.position.left*scale,
				y=this.selectedBox.position.top*scale,
				w=this.selectedBox.size*scale,
				h=this.selectedBox.size*scale;
				ctx.drawImage(this.srcImage,x,y,w,h,0,0,size,size);
				
				var uploadBtn=$("<button class='upload-btn'>上传</button>");
				$(".target-image-container").html("").append(canvas).append(uploadBtn);
				uploadBtn.click(function(){
					var src=canvas.toDataURL();
					src=src.split(",")[1];
					src=window.atob(src);
					
					var ua=new Uint8Array(src.length);
					for(var i=0;i<src.length;i++){
						ua[i]=src.charCodeAt(i);
					}
					var blob=new Blob([ua],{type:"image/png"});
					var fd=new FormData();
					fd.append("upload",blob);//fd.append("upload",blob,"文件名");
					$.ajax({
					    url:"upload",
					    type:"POST",
					    data:fd,
					    processData: false,
					    contentType: false,
					    success:function(){
					    	alert("上传成功！");
					    }
					});
				});
			};
			$(".clip-btn").on("click",function(){
				clipBox.clipImage();
			});
		})();
		
		return clipBox;
	};
		
	$(document).ready(function() {
		
    });
});
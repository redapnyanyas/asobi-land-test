/* Shared image validation and safe rendering. */
const AsobiSecurity=(()=>{
 const maxBytes=32*1024*1024,maxPixels=50000000;
 const raster=/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
 const storedImage=v=>typeof v==='string'&&v.length<=maxBytes&&raster.test(v);
 const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function load(file){
  if(!file||!file.size||file.size>maxBytes)throw Error('画像サイズが大きすぎます');
  const b=new Uint8Array(await file.slice(0,32).arrayBuffer());
  const at=(i,s)=>[...s].every((c,j)=>b[i+j]===c.charCodeAt(0));
  const png=b[0]===137&&at(1,'PNG')&&b[4]===13&&b[5]===10&&b[6]===26&&b[7]===10;
  const jpg=b[0]===255&&b[1]===216&&b[2]===255;
  const gif=at(0,'GIF87a')||at(0,'GIF89a');
  const webp=at(0,'RIFF')&&at(8,'WEBP');
  const heif=at(4,'ftyp')&&['heic','heix','hevc','hevx','mif1','msf1','avif','avis'].some(s=>at(8,s));
  const bmp=at(0,'BM');
  if(!(png||jpg||gif||webp||heif||bmp))throw Error('対応していない画像です');
  if(png&&b.length>=24){const d=new DataView(b.buffer);if(d.getUint32(16)*d.getUint32(20)>maxPixels)throw Error('画像が大きすぎます')}
  if(gif&&b.length>=10){const d=new DataView(b.buffer);if(d.getUint16(6,true)*d.getUint16(8,true)>maxPixels)throw Error('画像が大きすぎます')}
  const url=URL.createObjectURL(file);
  try{return await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{if(!im.naturalWidth||!im.naturalHeight||im.naturalWidth*im.naturalHeight>maxPixels)reject(Error('画像が大きすぎます'));else resolve(im)};im.onerror=()=>reject(Error('画像を開けません'));im.src=url})}finally{URL.revokeObjectURL(url)}
 }
 async function resize(file,size){const im=await load(file),cv=document.createElement('canvas'),k=Math.min(1,size/Math.max(im.width,im.height));cv.width=Math.max(1,Math.round(im.width*k));cv.height=Math.max(1,Math.round(im.height*k));cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);return cv.toDataURL('image/png')}
 function records(key,valid){try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a.filter(valid):[]}catch{return []}}
 return {load,resize,storedImage,escapeHTML,records};
})();

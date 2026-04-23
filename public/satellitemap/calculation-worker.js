// General calculation web worker for satellite functions
// Handles satellite calculations using SGP4 propagation without browser throttling

// Import satellite.js for SGP4 calculations
// Use absolute URL to satellite.min.js

!function(o,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(o="undefined"!=typeof globalThis?globalThis:o||self).satellite=t()}(this,(function(){"use strict";var o,t=Math.PI,e=2*t,s=t/180,a=180/t,n=398600.8,d=6378.135,i=60/Math.sqrt(650942.9922085947),r=d*i/60,c=1/i,h=.001082616,m=-253881e-11,l=-165597e-11,p=m/h,M=2/3,x=1440/(2*t),g=Object.freeze({__proto__:null,deg2rad:s,earthRadius:d,j2:h,j3:m,j3oj2:p,j4:l,minutesPerDay:1440,mu:n,pi:t,rad2deg:a,tumin:c,twoPi:e,vkmpersec:r,x2o3:M,xke:i,xpdotp:x});function u(o,t){for(var e=[31,o%4==0?29:28,31,30,31,30,31,31,30,31,30,31],s=Math.floor(t),a=1,n=0;s>n+e[a-1]&&a<12;)n+=e[a-1],a+=1;var d=a,i=s-n,r=24*(t-s),c=Math.floor(r);r=60*(r-c);var h=Math.floor(r);return{mon:d,day:i,hr:c,minute:h,sec:60*(r-h)}}function f(o,t,e,s,a,n){var d=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0;return 367*o-Math.floor(7*(o+Math.floor((t+9)/12))*.25)+Math.floor(275*t/9)+e+1721013.5+((d/6e4+n/60+a)/60+s)/24}function z(o,t,e,s,a,n){var d=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0;if(o instanceof Date){var i=o;return f(i.getUTCFullYear(),i.getUTCMonth()+1,i.getUTCDate(),i.getUTCHours(),i.getUTCMinutes(),i.getUTCSeconds(),i.getUTCMilliseconds())}return f(o,t,e,s,a,n,d)}function v(o,s){var a,n,d,i,r,c,h,m,l,p,M,x,g,u,f,z,v,b,y=o.e3,O=o.ee2,E=o.peo,w=o.pgho,T=o.pho,q=o.pinco,N=o.plo,R=o.se2,_=o.se3,C=o.sgh2,D=o.sgh3,j=o.sgh4,A=o.sh2,F=o.sh3,L=o.si2,I=o.si3,S=o.sl2,P=o.sl3,U=o.sl4,Z=o.t,B=o.xgh2,H=o.xgh3,Y=o.xgh4,k=o.xh2,G=o.xh3,W=o.xi2,J=o.xi3,K=o.xl2,Q=o.xl3,V=o.xl4,X=o.zmol,$=o.zmos,oo=s.init,to=s.opsmode,eo=s.ep,so=s.inclp,ao=s.nodep,no=s.argpp,io=s.mp;b=$+119459e-10*Z,"y"===oo&&(b=$),v=b+.0335*Math.sin(b);var ro=R*(h=.5*(u=Math.sin(v))*u-.25)+_*(m=-.5*u*Math.cos(v)),co=L*h+I*m,ho=S*h+P*m+U*u,mo=C*h+D*m+j*u,lo=A*h+F*m;return b=X+.00015835218*Z,"y"===oo&&(b=X),v=b+.1098*Math.sin(b),l=ro+(O*(h=.5*(u=Math.sin(v))*u-.25)+y*(m=-.5*u*Math.cos(v))),x=co+(W*h+J*m),g=ho+(K*h+Q*m+V*u),p=mo+(B*h+H*m+Y*u),M=lo+(k*h+G*m),"n"===oo&&(g-=N,p-=w,M-=T,so+=x-=q,eo+=l-=E,i=Math.sin(so),d=Math.cos(so),so>=.2?(no+=p-=d*(M/=i),ao+=M,io+=g):(a=i*(c=Math.sin(ao)),n=i*(r=Math.cos(ao)),a+=M*r+x*d*c,n+=-M*c+x*d*r,(ao%=e)<0&&"a"===to&&(ao+=e),f=io+no+d*ao,f+=g+p-x*ao*i,z=ao,(ao=Math.atan2(a,n))<0&&"a"===to&&(ao+=e),Math.abs(z-ao)>t&&(ao<z?ao+=e:ao-=e),no=f-(io+=g)-d*ao)),{ep:eo,inclp:so,nodep:ao,argpp:no,mp:io}}function b(o){var t=(o-2451545)/36525,a=-62e-7*t*t*t+.093104*t*t+3164400184.812866*t+67310.54841;return(a=a*s/240%e)<0&&(a+=e),a}function y(o,t,e,s,a,n,d){return o instanceof Date?b(z(o)):b(void 0!==t?z(o,t,e,s,a,n,d):o)}function O(s,a){var n,c,m,l,x,g,u,f,z,b,y,O,E,w,T,q,N,R,_,C,D,j,A,F,L,I;s.t=a,s.error=o.None;var S=s.mo+s.mdot*s.t,P=s.argpo+s.argpdot*s.t,U=s.nodeo+s.nodedot*s.t;f=P,C=S;var Z=s.t*s.t;if(j=U+s.nodecf*Z,q=1-s.cc1*s.t,N=s.bstar*s.cc4*s.t,R=s.t2cof*Z,1!==s.isimp){g=s.omgcof*s.t;var B=1+s.eta*Math.cos(S);C=S+(T=g+s.xmcof*(B*B*B-s.delmo)),f=P-T,O=(y=Z*s.t)*s.t,q=q-s.d2*Z-s.d3*y-s.d4*O,N+=s.bstar*s.cc5*(Math.sin(C)-s.sinmao),R=R+s.t3cof*y+O*(s.t4cof+s.t*s.t5cof)}D=s.no;var H=s.ecco;if(_=s.inclo,"d"===s.method){E=s.t;var Y=function(o){var t,s,a,n,d,i,r,c,h=o.irez,m=o.d2201,l=o.d2211,p=o.d3210,M=o.d3222,x=o.d4410,g=o.d4422,u=o.d5220,f=o.d5232,z=o.d5421,v=o.d5433,b=o.dedt,y=o.del1,O=o.del2,E=o.del3,w=o.didt,T=o.dmdt,q=o.dnodt,N=o.domdt,R=o.argpo,_=o.argpdot,C=o.t,D=o.tc,j=o.gsto,A=o.xfact,F=o.xlamo,L=o.no,I=o.atime,S=o.em,P=o.argpm,U=o.inclm,Z=o.xli,B=o.mm,H=o.xni,Y=o.nodem,k=o.nm,G=.13130908,W=2.8843198,J=.37448087,K=5.7686396,Q=.95240898,V=1.8014998,X=1.050833,$=4.4108898,oo=259200,to=0,eo=0,so=(j+.0043752690880113*D)%e;if(S+=b*C,U+=w*C,P+=N*C,Y+=q*C,B+=T*C,0!==h){(0===I||C*I<=0||Math.abs(C)<Math.abs(I))&&(I=0,H=L,Z=F),t=C>0?720:-720;for(var ao=381;381===ao;)2!==h?(r=y*Math.sin(Z-G)+O*Math.sin(2*(Z-W))+E*Math.sin(3*(Z-J)),d=H+A,i=y*Math.cos(Z-G)+2*O*Math.cos(2*(Z-W))+3*E*Math.cos(3*(Z-J)),i*=d):(a=(c=R+_*I)+c,s=Z+Z,r=m*Math.sin(a+Z-K)+l*Math.sin(Z-K)+p*Math.sin(c+Z-Q)+M*Math.sin(-c+Z-Q)+x*Math.sin(a+s-V)+g*Math.sin(s-V)+u*Math.sin(c+Z-X)+f*Math.sin(-c+Z-X)+z*Math.sin(c+s-$)+v*Math.sin(-c+s-$),d=H+A,i=m*Math.cos(a+Z-K)+l*Math.cos(Z-K)+p*Math.cos(c+Z-Q)+M*Math.cos(-c+Z-Q)+u*Math.cos(c+Z-X)+f*Math.cos(-c+Z-X)+2*(x*Math.cos(a+s-V)+g*Math.cos(s-V)+z*Math.cos(c+s-$)+v*Math.cos(-c+s-$)),i*=d),Math.abs(C-I)>=720?ao=381:(eo=C-I,ao=0),381===ao&&(Z+=d*t+r*oo,H+=r*t+i*oo,I+=t);k=H+r*eo+i*eo*eo*.5,n=Z+d*eo+r*eo*eo*.5,1!==h?(B=n-2*Y+2*so,to=k-L):(B=n-Y-P+so,to=k-L),k=L+to}return{atime:I,em:S,argpm:P,inclm:U,xli:Z,mm:B,xni:H,nodem:Y,dndt:to,nm:k}}({irez:s.irez,d2201:s.d2201,d2211:s.d2211,d3210:s.d3210,d3222:s.d3222,d4410:s.d4410,d4422:s.d4422,d5220:s.d5220,d5232:s.d5232,d5421:s.d5421,d5433:s.d5433,dedt:s.dedt,del1:s.del1,del2:s.del2,del3:s.del3,didt:s.didt,dmdt:s.dmdt,dnodt:s.dnodt,domdt:s.domdt,argpo:s.argpo,argpdot:s.argpdot,t:s.t,tc:E,gsto:s.gsto,xfact:s.xfact,xlamo:s.xlamo,no:s.no,atime:s.atime,em:H,argpm:f,inclm:_,xli:s.xli,mm:C,xni:s.xni,nodem:j,nm:D});H=Y.em,f=Y.argpm,_=Y.inclm,C=Y.mm,j=Y.nodem,D=Y.nm}if(D<=0)return s.error=o.MeanMotionBelowZero,null;var k=Math.pow(i/D,M)*q*q;if(D=i/Math.pow(k,1.5),(H-=N)>=1||H<-.001)return s.error=o.MeanEccentricityOutOfRange,null;H<1e-6&&(H=1e-6),F=(C+=s.no*R)+f+j;var G={am:k,em:H,im:_,Om:j%=e,om:f%=e,mm:C=((F%=e)-f-j)%e,nm:D},W=H;if(A=_,z=f,I=j,L=C,l=Math.sin(_),m=Math.cos(_),"d"===s.method){var J=v(s,{inclo:s.inclo,init:"n",ep:W,inclp:A,nodep:I,argpp:z,mp:L,opsmode:s.operationmode});if(W=J.ep,I=J.nodep,z=J.argpp,L=J.mp,(A=J.inclp)<0&&(A=-A,I+=t,z-=t),W<0||W>1)return s.error=o.PerturbedEccentricityOutOfRange,null}"d"===s.method&&(l=Math.sin(A),m=Math.cos(A),s.aycof=-.5*p*l,Math.abs(m+1)>15e-13?s.xlcof=-.25*p*l*(3+5*m)/(1+m):s.xlcof=-.25*p*l*(3+5*m)/15e-13);var K=W*Math.cos(z);T=1/(k*(1-W*W));var Q=W*Math.sin(z)+T*s.aycof,V=(L+z+I+T*s.xlcof*K-I)%e;u=V,w=9999.9;for(var X=1;Math.abs(w)>=1e-12&&X<=10;)c=Math.sin(u),w=(V-Q*(n=Math.cos(u))+K*c-u)/(w=1-n*K-c*Q),Math.abs(w)>=.95&&(w=w>0?.95:-.95),u+=w,X+=1;var $=K*n+Q*c,oo=K*c-Q*n,to=K*K+Q*Q,eo=k*(1-to);if(eo<0)return s.error=o.SemiLatusRectumBelowZero,null;var so=k*(1-$),ao=Math.sqrt(k)*oo/so,no=Math.sqrt(eo)/so,io=Math.sqrt(1-to),ro=k/so*(c-Q-K*(T=oo/(1+io))),co=k/so*(n-K+Q*T);b=Math.atan2(ro,co);var ho=(co+co)*ro,mo=1-2*ro*ro,lo=.5*h*(T=1/eo),po=lo*T;"d"===s.method&&(x=m*m,s.con41=3*x-1,s.x1mth2=1-x,s.x7thm1=7*x-1);var Mo=so*(1-1.5*po*io*s.con41)+.5*lo*s.x1mth2*mo;if(Mo<1)return s.error=o.Decayed,null;b-=.25*po*s.x7thm1*ho;var xo=I+1.5*po*m*ho,go=A+1.5*po*m*l*mo,uo=ao-D*lo*s.x1mth2*ho/i,fo=no+D*lo*(s.x1mth2*mo+1.5*s.con41)/i,zo=Math.sin(b),vo=Math.cos(b),bo=Math.sin(xo),yo=Math.cos(xo),Oo=Math.sin(go),Eo=Math.cos(go),wo=-bo*Eo,To=yo*Eo,qo=wo*zo+yo*vo,No=To*zo+bo*vo,Ro=Oo*zo;return{position:{x:Mo*qo*d,y:Mo*No*d,z:Mo*Ro*d},velocity:{x:(uo*qo+fo*(wo*vo-yo*zo))*r,y:(uo*No+fo*(To*vo-bo*zo))*r,z:(uo*Ro+fo*(Oo*vo))*r},meanElements:G}}function E(o,s){var a,n,r,m,x,g,u,f,z,b,E,w,T,q,N,R,_,C,D,j,A,F,L,I,S,P,U,Z,B,H,Y,k,G,W,J,K,Q,V,X,$,oo,to,eo,so,ao,no,io,ro,co,ho,mo,lo,po=s.opsmode,Mo=s.satn,xo=s.epoch,go=s.xbstar,uo=s.xecco,fo=s.xargpo,zo=s.xinclo,vo=s.xmo,bo=s.xno,yo=s.xnodeo,Oo=o;Oo.isimp=0,Oo.method="n",Oo.aycof=0,Oo.con41=0,Oo.cc1=0,Oo.cc4=0,Oo.cc5=0,Oo.d2=0,Oo.d3=0,Oo.d4=0,Oo.delmo=0,Oo.eta=0,Oo.argpdot=0,Oo.omgcof=0,Oo.sinmao=0,Oo.t=0,Oo.t2cof=0,Oo.t3cof=0,Oo.t4cof=0,Oo.t5cof=0,Oo.x1mth2=0,Oo.x7thm1=0,Oo.mdot=0,Oo.nodedot=0,Oo.xlcof=0,Oo.xmcof=0,Oo.nodecf=0,Oo.irez=0,Oo.d2201=0,Oo.d2211=0,Oo.d3210=0,Oo.d3222=0,Oo.d4410=0,Oo.d4422=0,Oo.d5220=0,Oo.d5232=0,Oo.d5421=0,Oo.d5433=0,Oo.dedt=0,Oo.del1=0,Oo.del2=0,Oo.del3=0,Oo.didt=0,Oo.dmdt=0,Oo.dnodt=0,Oo.domdt=0,Oo.e3=0,Oo.ee2=0,Oo.peo=0,Oo.pgho=0,Oo.pho=0,Oo.pinco=0,Oo.plo=0,Oo.se2=0,Oo.se3=0,Oo.sgh2=0,Oo.sgh3=0,Oo.sgh4=0,Oo.sh2=0,Oo.sh3=0,Oo.si2=0,Oo.si3=0,Oo.sl2=0,Oo.sl3=0,Oo.sl4=0,Oo.gsto=0,Oo.xfact=0,Oo.xgh2=0,Oo.xgh3=0,Oo.xgh4=0,Oo.xh2=0,Oo.xh3=0,Oo.xi2=0,Oo.xi3=0,Oo.xl2=0,Oo.xl3=0,Oo.xl4=0,Oo.xlamo=0,Oo.zmol=0,Oo.zmos=0,Oo.atime=0,Oo.xli=0,Oo.xni=0,Oo.bstar=go,Oo.ecco=uo,Oo.argpo=fo,Oo.inclo=zo,Oo.mo=vo,Oo.no=bo,Oo.nodeo=yo,Oo.operationmode=po;var Eo=78/d+1;Oo.init="y",Oo.t=0;var wo=function(o){var t=o.ecco,s=o.epoch,a=o.inclo,n=o.opsmode,d=o.no,r=t*t,c=1-r,m=Math.sqrt(c),l=Math.cos(a),p=l*l,x=Math.pow(i/d,M),g=.75*h*(3*p-1)/(m*c),u=g/(x*x),f=x*(1-u*u-u*(1/3+134*u*u/81));d/=1+(u=g/(f*f));var z,v=Math.pow(i/d,M),b=Math.sin(a),O=v*c,E=1-5*p,w=-E-p-p,T=1/v,q=O*O,N=v*(1-t);if("a"===n){var R=s-7305,_=Math.floor(R+1e-8),C=.017202791694070362;(z=(1.7321343856509375+C*_+(C+e)*(R-_)+R*R*5075514194322695e-30)%e)<0&&(z+=e)}else z=y(s+2433281.5);return{no:d,method:"n",ainv:T,ao:v,con41:w,con42:E,cosio:l,cosio2:p,eccsq:r,omeosq:c,posq:q,rp:N,rteosq:m,sinio:b,gsto:z}}({satn:Mo,ecco:Oo.ecco,epoch:xo,inclo:Oo.inclo,no:Oo.no,method:Oo.method,opsmode:Oo.operationmode}),To=wo.ao,qo=wo.con42,No=wo.cosio,Ro=wo.cosio2,_o=wo.eccsq,Co=wo.omeosq,Do=wo.posq,jo=wo.rp,Ao=wo.rteosq,Fo=wo.sinio;if(Oo.no=wo.no,Oo.con41=wo.con41,Oo.gsto=wo.gsto,Oo.a=Math.pow(Oo.no*c,-2/3),Oo.alta=Oo.a*(1+Oo.ecco)-1,Oo.altp=Oo.a*(1-Oo.ecco)-1,Oo.error=0,Co>=0||Oo.no>=0){if(Oo.isimp=0,jo<1.034492841559484&&(Oo.isimp=1),I=Eo,C=1.880279159015271e-9,(N=(jo-1)*d)<156){I=N-78,N<98&&(I=20);var Lo=(120-I)/d;C=Lo*Lo*Lo*Lo,I=I/d+1}R=1/Do,to=1/(To-I),Oo.eta=To*Oo.ecco*to,w=Oo.eta*Oo.eta,E=Oo.ecco*Oo.eta,_=Math.abs(1-w),m=(u=(g=C*Math.pow(to,4))/Math.pow(_,3.5))*Oo.no*(To*(1+1.5*w+E*(4+w))+.375*h*to/_*Oo.con41*(8+3*w*(8+w))),Oo.cc1=Oo.bstar*m,x=0,Oo.ecco>1e-4&&(x=-2*g*to*p*Oo.no*Fo/Oo.ecco),Oo.x1mth2=1-Ro,Oo.cc4=2*Oo.no*u*To*Co*(Oo.eta*(2+.5*w)+Oo.ecco*(.5+2*w)-h*to/(To*_)*(-3*Oo.con41*(1-2*E+w*(1.5-.5*E))+.75*Oo.x1mth2*(2*w-E*(1+w))*Math.cos(2*Oo.argpo))),Oo.cc5=2*u*To*Co*(1+2.75*(w+E)+E*w),f=Ro*Ro,$=.5*(X=1.5*h*R*Oo.no)*h*R,oo=-.46875*l*R*R*Oo.no,Oo.mdot=Oo.no+.5*X*Ao*Oo.con41+.0625*$*Ao*(13-78*Ro+137*f),Oo.argpdot=-.5*X*qo+.0625*$*(7-114*Ro+395*f)+oo*(3-36*Ro+49*f),so=-X*No,Oo.nodedot=so+(.5*$*(4-19*Ro)+2*oo*(3-7*Ro))*No,eo=Oo.argpdot+Oo.nodedot,Oo.omgcof=Oo.bstar*x*Math.cos(Oo.argpo),Oo.xmcof=0,Oo.ecco>1e-4&&(Oo.xmcof=-M*g*Oo.bstar/E),Oo.nodecf=3.5*Co*so*Oo.cc1,Oo.t2cof=1.5*Oo.cc1,Math.abs(No+1)>15e-13?Oo.xlcof=-.25*p*Fo*(3+5*No)/(1+No):Oo.xlcof=-.25*p*Fo*(3+5*No)/15e-13,Oo.aycof=-.5*p*Fo;var Io=1+Oo.eta*Math.cos(Oo.mo);if(Oo.delmo=Io*Io*Io,Oo.sinmao=Math.sin(Oo.mo),Oo.x7thm1=7*Ro-1,2*t/Oo.no>=225){Oo.method="d",Oo.isimp=1,T=Oo.inclo;var So=function(o){var t,s,a,n,d,i,r,c,h,m,l,p,M,x,g,u,f,z,v,b,y,O,E,w,T,q,N,R,_,C,D,j,A,F,L,I,S,P,U,Z,B,H,Y,k,G,W,J,K,Q,V,X,$,oo,to,eo,so,ao,no,io,ro,co,ho,mo,lo=o.epoch,po=o.ep,Mo=o.argpp,xo=o.tc,go=o.inclp,uo=o.nodep,fo=.01675,zo=.0549,vo=o.np,bo=po,yo=Math.sin(uo),Oo=Math.cos(uo),Eo=Math.sin(Mo),wo=Math.cos(Mo),To=Math.sin(go),qo=Math.cos(go),No=bo*bo,Ro=1-No,_o=Math.sqrt(Ro),Co=lo+18261.5+xo/1440,Do=(4.523602-.00092422029*Co)%e,jo=Math.sin(Do),Ao=Math.cos(Do),Fo=.91375164-.03568096*Ao,Lo=Math.sqrt(1-Fo*Fo),Io=.089683511*jo/Lo,So=Math.sqrt(1-Io*Io),Po=5.8351514+.001944368*Co,Uo=.39785416*jo/Lo,Zo=So*Ao+.91744867*Io*jo;Uo=Math.atan2(Uo,Zo),Uo+=Po-Do;var Bo=Math.cos(Uo),Ho=Math.sin(Uo);b=.1945905,y=-.98088458,w=.91744867,T=.39785416,O=Oo,E=yo,l=29864797e-13;for(var Yo=1/vo,ko=0;ko<2;)eo=-6*(t=b*O+y*w*E)*(d=-To*(r=-b*E+y*w*O)+qo*(c=y*T))+No*(-24*(p=t*wo+(s=qo*r+To*c)*Eo)*(z=d*wo)-6*(x=-t*Eo+s*wo)*(u=d*Eo)),so=-6*(t*(i=-To*(h=y*E+b*w*O)+qo*(m=b*T))+(a=-y*O+b*w*E)*d)+No*(-24*((M=a*wo+(n=qo*h+To*m)*Eo)*z+p*(v=i*wo))+-6*(x*(f=i*Eo)+(g=-a*Eo+n*wo)*u)),ao=-6*a*i+No*(-24*M*v-6*g*f),no=6*s*d+No*(24*p*u-6*x*z),io=6*(n*d+s*i)+No*(24*(M*u+p*f)-6*(g*z+x*v)),ro=6*n*i+No*(24*M*f-6*g*v),$=($=3*(t*t+s*s)+(co=12*p*p-3*x*x)*No)+$+Ro*co,oo=(oo=6*(t*a+s*n)+(ho=24*p*M-6*x*g)*No)+oo+Ro*ho,to=(to=3*(a*a+n*n)+(mo=12*M*M-3*g*g)*No)+to+Ro*mo,W=-.5*(J=l*Yo)/_o,G=-15*bo*(K=J*_o),Q=p*x+M*g,V=M*x+p*g,X=M*g-p*x,1===(ko+=1)&&(q=G,N=W,R=J,_=K,C=Q,D=V,j=X,A=$,F=oo,L=to,I=eo,S=so,P=ao,U=no,Z=io,B=ro,H=co,Y=ho,k=mo,b=Bo,y=Ho,w=Fo,T=Lo,O=So*Oo+Io*yo,E=yo*So-Oo*Io,l=4.7968065e-7);return{snodm:yo,cnodm:Oo,sinim:To,cosim:qo,sinomm:Eo,cosomm:wo,day:Co,e3:2*G*X,ee2:2*G*V,em:bo,emsq:No,gam:Po,peo:0,pgho:0,pho:0,pinco:0,plo:0,rtemsq:_o,se2:2*q*D,se3:2*q*j,sgh2:2*_*Y,sgh3:2*_*(k-H),sgh4:-18*_*fo,sh2:-2*N*Z,sh3:-2*N*(B-U),si2:2*N*S,si3:2*N*(P-I),sl2:-2*R*F,sl3:-2*R*(L-A),sl4:-2*R*(-21-9*No)*fo,s1:G,s2:W,s3:J,s4:K,s5:Q,s6:V,s7:X,ss1:q,ss2:N,ss3:R,ss4:_,ss5:C,ss6:D,ss7:j,sz1:A,sz2:F,sz3:L,sz11:I,sz12:S,sz13:P,sz21:U,sz22:Z,sz23:B,sz31:H,sz32:Y,sz33:k,xgh2:2*K*ho,xgh3:2*K*(mo-co),xgh4:-18*K*zo,xh2:-2*W*io,xh3:-2*W*(ro-no),xi2:2*W*so,xi3:2*W*(ao-eo),xl2:-2*J*oo,xl3:-2*J*(to-$),xl4:-2*J*(-21-9*No)*zo,nm:vo,z1:$,z2:oo,z3:to,z11:eo,z12:so,z13:ao,z21:no,z22:io,z23:ro,z31:co,z32:ho,z33:mo,zmol:(.2299715*Co-Po+4.7199672)%e,zmos:(6.2565837+.017201977*Co)%e}}({epoch:xo,ep:Oo.ecco,argpp:Oo.argpo,tc:0,inclp:Oo.inclo,nodep:Oo.nodeo,np:Oo.no,e3:Oo.e3,ee2:Oo.ee2,peo:Oo.peo,pgho:Oo.pgho,pho:Oo.pho,pinco:Oo.pinco,plo:Oo.plo,se2:Oo.se2,se3:Oo.se3,sgh2:Oo.sgh2,sgh3:Oo.sgh3,sgh4:Oo.sgh4,sh2:Oo.sh2,sh3:Oo.sh3,si2:Oo.si2,si3:Oo.si3,sl2:Oo.sl2,sl3:Oo.sl3,sl4:Oo.sl4,xgh2:Oo.xgh2,xgh3:Oo.xgh3,xgh4:Oo.xgh4,xh2:Oo.xh2,xh3:Oo.xh3,xi2:Oo.xi2,xi3:Oo.xi3,xl2:Oo.xl2,xl3:Oo.xl3,xl4:Oo.xl4,zmol:Oo.zmol,zmos:Oo.zmos});Oo.e3=So.e3,Oo.ee2=So.ee2,Oo.peo=So.peo,Oo.pgho=So.pgho,Oo.pho=So.pho,Oo.pinco=So.pinco,Oo.plo=So.plo,Oo.se2=So.se2,Oo.se3=So.se3,Oo.sgh2=So.sgh2,Oo.sgh3=So.sgh3,Oo.sgh4=So.sgh4,Oo.sh2=So.sh2,Oo.sh3=So.sh3,Oo.si2=So.si2,Oo.si3=So.si3,Oo.sl2=So.sl2,Oo.sl3=So.sl3,Oo.sl4=So.sl4,n=So.sinim,a=So.cosim,z=So.em,b=So.emsq,D=So.s1,j=So.s2,A=So.s3,F=So.s4,L=So.s5,S=So.ss1,P=So.ss2,U=So.ss3,Z=So.ss4,B=So.ss5,H=So.sz1,Y=So.sz3,k=So.sz11,G=So.sz13,W=So.sz21,J=So.sz23,K=So.sz31,Q=So.sz33,Oo.xgh2=So.xgh2,Oo.xgh3=So.xgh3,Oo.xgh4=So.xgh4,Oo.xh2=So.xh2,Oo.xh3=So.xh3,Oo.xi2=So.xi2,Oo.xi3=So.xi3,Oo.xl2=So.xl2,Oo.xl3=So.xl3,Oo.xl4=So.xl4,Oo.zmol=So.zmol,Oo.zmos=So.zmos,q=So.nm,ao=So.z1,no=So.z3,io=So.z11,ro=So.z13,co=So.z21,ho=So.z23,mo=So.z31,lo=So.z33;var Po=v(Oo,{inclo:T,init:Oo.init,ep:Oo.ecco,inclp:Oo.inclo,nodep:Oo.nodeo,argpp:Oo.argpo,mp:Oo.mo,opsmode:Oo.operationmode});Oo.ecco=Po.ep,Oo.inclo=Po.inclp,Oo.nodeo=Po.nodep,Oo.argpo=Po.argpp,Oo.mo=Po.mp;var Uo=function(o){var s,a,n,d,r,c,h,m,l,p,x,g,u,f,z,v,b,y=o.cosim,O=o.argpo,E=o.s1,w=o.s2,T=o.s3,q=o.s4,N=o.s5,R=o.sinim,_=o.ss1,C=o.ss2,D=o.ss3,j=o.ss4,A=o.ss5,F=o.sz1,L=o.sz3,I=o.sz11,S=o.sz13,P=o.sz21,U=o.sz23,Z=o.sz31,B=o.sz33,H=o.t,Y=o.tc,k=o.gsto,G=o.mo,W=o.mdot,J=o.no,K=o.nodeo,Q=o.nodedot,V=o.xpidot,X=o.z1,$=o.z3,oo=o.z11,to=o.z13,eo=o.z21,so=o.z23,ao=o.z31,no=o.z33,io=o.ecco,ro=o.eccsq,co=o.emsq,ho=o.em,mo=o.argpm,lo=o.inclm,po=o.mm,Mo=o.nm,xo=o.nodem,go=o.irez,uo=o.atime,fo=o.d2201,zo=o.d2211,vo=o.d3210,bo=o.d3222,yo=o.d4410,Oo=o.d4422,Eo=o.d5220,wo=o.d5232,To=o.d5421,qo=o.d5433,No=o.dedt,Ro=o.didt,_o=o.dmdt,Co=o.dnodt,Do=o.domdt,jo=o.del1,Ao=o.del2,Fo=o.del3,Lo=o.xfact,Io=o.xlamo,So=o.xli,Po=o.xni,Uo=.0043752690880113,Zo=.00015835218,Bo=119459e-10;go=0,Mo<.0052359877&&Mo>.0034906585&&(go=1),Mo>=.00826&&Mo<=.00924&&ho>=.5&&(go=2);var Ho=-Bo*C*(P+U);(lo<.052359877||lo>t-.052359877)&&(Ho=0),0!==R&&(Ho/=R);var Yo=-Zo*w*(eo+so);(lo<.052359877||lo>t-.052359877)&&(Yo=0),Do=j*Bo*(Z+B-6)-y*Ho+q*Zo*(ao+no-6),Co=Ho,0!==R&&(Do-=y/R*Yo,Co+=Yo/R);var ko=(k+Y*Uo)%e;if(ho+=(No=_*Bo*A+E*Zo*N)*H,lo+=(Ro=C*Bo*(I+S)+w*Zo*(oo+to))*H,mo+=Do*H,xo+=Co*H,po+=(_o=-Bo*D*(F+L-14-6*co)-Zo*T*(X+$-14-6*co))*H,0!==go){if(z=Math.pow(Mo/i,M),2===go){var Go=ho,Wo=co;b=(ho=io)*(co=ro),ho<=.65?(n=3.616-13.247*ho+16.29*co,d=117.39*ho-19.302-228.419*co+156.591*b,r=109.7927*ho-18.9068-214.6334*co+146.5816*b,c=242.694*ho-41.122-471.094*co+313.953*b,h=841.88*ho-146.407-1629.014*co+1083.435*b,m=3017.977*ho-532.114-5740.032*co+3708.276*b):(n=331.819*ho-72.099-508.738*co+266.724*b,d=1582.851*ho-346.844-2415.925*co+1246.113*b,r=1554.908*ho-342.585-2366.899*co+1215.972*b,c=4758.686*ho-1052.797-7193.992*co+3651.957*b,h=16178.11*ho-3581.69-24462.77*co+12422.52*b,m=ho>.715?29936.92*ho-5149.66-54087.36*co+31324.56*b:1464.74-4664.75*ho+3763.64*co),ho<.7?(x=4988.61*ho-919.2277-9064.77*co+5542.21*b,l=4568.6173*ho-822.71072-8491.4146*co+5337.524*b,p=4690.25*ho-853.666-8624.77*co+5341.4*b):(x=161616.52*ho-37995.78-229838.2*co+109377.94*b,l=218913.95*ho-51752.104-309468.16*co+146349.42*b,p=170470.89*ho-40023.88-242699.48*co+115605.82*b),fo=(u=17891679e-13*(f=Mo*Mo*3*(z*z)))*(s=.75*(1+2*y+(v=y*y)))*(-.306-.44*(ho-.64)),zo=u*(1.5*(g=R*R))*n,vo=(u=3.7393792e-7*(f*=z))*(1.875*R*(1-2*y-3*v))*d,bo=u*(-1.875*R*(1+2*y-3*v))*r,yo=(u=2*(f*=z)*7.3636953e-9)*(35*g*s)*c,Oo=u*(39.375*g*g)*h,Eo=(u=1.1428639e-7*(f*=z))*(9.84375*R*(g*(1-2*y-5*v)+.33333333*(4*y-2+6*v)))*m,wo=u*(R*(4.92187512*g*(-2-4*y+10*v)+6.56250012*(1+2*y-3*v)))*p,To=(u=2*f*2.1765803e-9)*(29.53125*R*(2-8*y+v*(8*y-12+10*v)))*l,qo=u*(29.53125*R*(-2-8*y+v*(12+8*y-10*v)))*x,Io=(G+K+K-(ko+ko))%e,Lo=W+_o+2*(Q+Co-Uo)-J,ho=Go,co=Wo}1===go&&(a=1+y,Ao=2*(jo=3*Mo*Mo*z*z)*(s=.75*(1+y)*(1+y))*(1+co*(.8125*co-2.5))*17891679e-13,Fo=3*jo*(a*=1.875*a*a)*(1+co*(6.60937*co-6))*2.2123015e-7*z,jo=jo*(.9375*R*R*(1+3*y)-.75*(1+y))*(d=1+2*co)*21460748e-13*z,Io=(G+K+O-ko)%e,Lo=W+V+_o+Do+Co-(J+Uo)),So=Io,Po=J,uo=0,Mo=J+0}return{em:ho,argpm:mo,inclm:lo,mm:po,nm:Mo,nodem:xo,irez:go,atime:uo,d2201:fo,d2211:zo,d3210:vo,d3222:bo,d4410:yo,d4422:Oo,d5220:Eo,d5232:wo,d5421:To,d5433:qo,dedt:No,didt:Ro,dmdt:_o,dndt:0,dnodt:Co,domdt:Do,del1:jo,del2:Ao,del3:Fo,xfact:Lo,xlamo:Io,xli:So,xni:Po}}({cosim:a,emsq:b,argpo:Oo.argpo,s1:D,s2:j,s3:A,s4:F,s5:L,sinim:n,ss1:S,ss2:P,ss3:U,ss4:Z,ss5:B,sz1:H,sz3:Y,sz11:k,sz13:G,sz21:W,sz23:J,sz31:K,sz33:Q,t:Oo.t,tc:0,gsto:Oo.gsto,mo:Oo.mo,mdot:Oo.mdot,no:Oo.no,nodeo:Oo.nodeo,nodedot:Oo.nodedot,xpidot:eo,z1:ao,z3:no,z11:io,z13:ro,z21:co,z23:ho,z31:mo,z33:lo,ecco:Oo.ecco,eccsq:_o,em:z,argpm:0,inclm:T,mm:0,nm:q,nodem:0,irez:Oo.irez,atime:Oo.atime,d2201:Oo.d2201,d2211:Oo.d2211,d3210:Oo.d3210,d3222:Oo.d3222,d4410:Oo.d4410,d4422:Oo.d4422,d5220:Oo.d5220,d5232:Oo.d5232,d5421:Oo.d5421,d5433:Oo.d5433,dedt:Oo.dedt,didt:Oo.didt,dmdt:Oo.dmdt,dnodt:Oo.dnodt,domdt:Oo.domdt,del1:Oo.del1,del2:Oo.del2,del3:Oo.del3,xfact:Oo.xfact,xlamo:Oo.xlamo,xli:Oo.xli,xni:Oo.xni});Oo.irez=Uo.irez,Oo.atime=Uo.atime,Oo.d2201=Uo.d2201,Oo.d2211=Uo.d2211,Oo.d3210=Uo.d3210,Oo.d3222=Uo.d3222,Oo.d4410=Uo.d4410,Oo.d4422=Uo.d4422,Oo.d5220=Uo.d5220,Oo.d5232=Uo.d5232,Oo.d5421=Uo.d5421,Oo.d5433=Uo.d5433,Oo.dedt=Uo.dedt,Oo.didt=Uo.didt,Oo.dmdt=Uo.dmdt,Oo.dnodt=Uo.dnodt,Oo.domdt=Uo.domdt,Oo.del1=Uo.del1,Oo.del2=Uo.del2,Oo.del3=Uo.del3,Oo.xfact=Uo.xfact,Oo.xlamo=Uo.xlamo,Oo.xli=Uo.xli,Oo.xni=Uo.xni}1!==Oo.isimp&&(r=Oo.cc1*Oo.cc1,Oo.d2=4*To*to*r,V=Oo.d2*to*Oo.cc1/3,Oo.d3=(17*To+I)*V,Oo.d4=.5*V*To*to*(221*To+31*I)*Oo.cc1,Oo.t3cof=Oo.d2+2*r,Oo.t4cof=.25*(3*Oo.d3+Oo.cc1*(12*Oo.d2+10*r)),Oo.t5cof=.2*(3*Oo.d4+12*Oo.cc1*Oo.d3+6*Oo.d2*Oo.d2+15*r*(2*Oo.d2+r)))}O(Oo,0),Oo.init="n"}!function(o){o[o.None=0]="None",o[o.MeanEccentricityOutOfRange=1]="MeanEccentricityOutOfRange",o[o.MeanMotionBelowZero=2]="MeanMotionBelowZero",o[o.PerturbedEccentricityOutOfRange=3]="PerturbedEccentricityOutOfRange",o[o.SemiLatusRectumBelowZero=4]="SemiLatusRectumBelowZero",o[o.Decayed=6]="Decayed"}(o||(o={}));var w=Object.freeze({__proto__:null}),T=7292115e-11;function q(o){return o*a}function N(o){return o*s}function R(o){var t=o.longitude,e=o.latitude,s=o.height,a=6378.137,n=(a-6356.7523142)/a,d=2*n-n*n,i=a/Math.sqrt(1-d*(Math.sin(e)*Math.sin(e)));return{x:(i+s)*Math.cos(e)*Math.cos(t),y:(i+s)*Math.cos(e)*Math.sin(t),z:(i*(1-d)+s)*Math.sin(e)}}var _=Object.assign(Object.assign({constants:g,propagate:function(o){for(var t=arguments.length,e=new Array(t>1?t-1:0),s=1;s<t;s++)e[s-1]=arguments[s];return O(o,1440*(z.apply(void 0,e)-o.jdsatepoch))},sgp4:O,twoline2satrec:function(o,t){var e=o.substring(2,7),a=parseInt(o.substring(18,20),10),n=parseFloat(o.substring(20,32)),d=parseFloat(o.substring(33,43)),i=parseFloat("".concat(o.substring(44,45),".").concat(o.substring(45,50),"E").concat(o.substring(50,52))),r=parseFloat("".concat(o.substring(53,54),".").concat(o.substring(54,59),"E").concat(o.substring(59,61))),c=parseFloat(t.substring(8,16))*s,h=parseFloat(t.substring(17,25))*s,m=parseFloat(".".concat(t.substring(26,33))),l=parseFloat(t.substring(34,42))*s,p=parseFloat(t.substring(43,51))*s,M=parseFloat(t.substring(52,63))/x,g=a<57?a+2e3:a+1900,f=u(g,n),v={error:0,satnum:e,epochyr:a,epochdays:n,ndot:d,nddot:i,bstar:r,inclo:c,nodeo:h,ecco:m,argpo:l,mo:p,no:M,jdsatepoch:z(g,f.mon,f.day,f.hr,f.minute,f.sec)};return E(v,{opsmode:"i",satn:v.satnum,epoch:v.jdsatepoch-2433281.5,xbstar:v.bstar,xecco:v.ecco,xargpo:v.argpo,xinclo:v.inclo,xmo:v.mo,xno:v.no,xnodeo:v.nodeo}),v},json2satrec:function(o){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"i",e=o.NORAD_CAT_ID.toString(),a=new Date(o.EPOCH.endsWith("Z")?o.EPOCH:o.EPOCH+"Z"),n=a.getUTCFullYear(),d=Number(n.toString().slice(-2)),i=(a.valueOf()-new Date(Date.UTC(n,0,1,0,0,0)).valueOf())/864e5+1,r=Number(o.MEAN_MOTION_DOT),c=Number(o.MEAN_MOTION_DDOT),h=Number(o.BSTAR),m=Number(o.INCLINATION)*s,l=Number(o.RA_OF_ASC_NODE)*s,p=Number(o.ECCENTRICITY),M=Number(o.ARG_OF_PERICENTER)*s,g=Number(o.MEAN_ANOMALY)*s,f=Number(o.MEAN_MOTION)/x,v=u(n,i),b={error:0,satnum:e,epochyr:d,epochdays:i,ndot:r,nddot:c,bstar:h,inclo:m,nodeo:l,ecco:p,argpo:M,mo:g,no:f,jdsatepoch:z(n,v.mon,v.day,v.hr,v.minute,v.sec)};return E(b,{opsmode:t,satn:b.satnum,epoch:b.jdsatepoch-2433281.5,xbstar:b.bstar,xecco:b.ecco,xargpo:b.argpo,xinclo:b.inclo,xmo:b.mo,xno:b.no,xnodeo:b.nodeo}),b},gstime:y,jday:z,invjday:function(o,t){var e=o-2415019.5,s=e/365.25,a=1900+Math.floor(s),n=Math.floor(.25*(a-1901)),d=e-(365*(a-1900)+n)+1e-11;d<1&&(d=e-(365*((a-=1)-1900)+(n=Math.floor(.25*(a-1901)))));var i=u(a,d),r=i.mon,c=i.day,h=i.hr,m=i.minute,l=i.sec-864e-9;return t?[a,r,c,h,m,Math.floor(l)]:new Date(Date.UTC(a,r-1,c,h,m,Math.floor(l)))},dopplerFactor:function(o,t,e){var s=t.x-o.x,a=t.y-o.y,n=t.z-o.z,d=Math.sqrt(Math.pow(s,2)+Math.pow(a,2)+Math.pow(n,2));return 1-(s*(e.x+T*o.y)+a*(e.y-T*o.x)+n*e.z)/d/299792.458},radiansToDegrees:q,degreesToRadians:N,degreesLat:function(o){if(o<-t/2||o>t/2)throw new RangeError("Latitude radians must be in range [-pi/2; pi/2].");return q(o)},degreesLong:function(o){if(o<-t||o>t)throw new RangeError("Longitude radians must be in range [-pi; pi].");return q(o)},radiansLat:function(o){if(o<-90||o>90)throw new RangeError("Latitude degrees must be in range [-90; 90].");return N(o)},radiansLong:function(o){if(o<-180||o>180)throw new RangeError("Longitude degrees must be in range [-180; 180].");return N(o)},geodeticToEcf:R,eciToGeodetic:function(o,s){for(var a=6378.137,n=Math.sqrt(o.x*o.x+o.y*o.y),d=(a-6356.7523142)/a,i=2*d-d*d,r=Math.atan2(o.y,o.x)-s;r<-t;)r+=e;for(;r>t;)r-=e;for(var c,h=0,m=Math.atan2(o.z,Math.sqrt(o.x*o.x+o.y*o.y));h++<20;)c=1/Math.sqrt(1-i*(Math.sin(m)*Math.sin(m))),m=Math.atan2(o.z+a*c*i*Math.sin(m),n);return{longitude:r,latitude:m,height:n/Math.cos(m)-a*c}},eciToEcf:function(o,t){return{x:o.x*Math.cos(t)+o.y*Math.sin(t),y:o.x*-Math.sin(t)+o.y*Math.cos(t),z:o.z}},ecfToEci:function(o,t){return{x:o.x*Math.cos(t)-o.y*Math.sin(t),y:o.x*Math.sin(t)+o.y*Math.cos(t),z:o.z}},ecfToLookAngles:function(o,e){var s,a,n,d,i,r,c=function(o,t){var e=o.longitude,s=o.latitude,a=R(o),n=t.x-a.x,d=t.y-a.y,i=t.z-a.z;return{topS:Math.sin(s)*Math.cos(e)*n+Math.sin(s)*Math.sin(e)*d-Math.cos(s)*i,topE:-Math.sin(e)*n+Math.cos(e)*d,topZ:Math.cos(s)*Math.cos(e)*n+Math.cos(s)*Math.sin(e)*d+Math.sin(s)*i}}(o,e);return a=(s=c).topS,n=s.topE,d=s.topZ,i=Math.sqrt(a*a+n*n+d*d),r=Math.asin(d/i),{azimuth:Math.atan2(-n,a)+t,elevation:r,rangeSat:i}},sunPos:function(o){var a=(o-2451545)/36525,n=a,d=(357.5277233+35999.05034*n*s)%e;d<0&&(d+=e);var i=((280.46+36000.77*a)%360+1.914666471*Math.sin(d)+.019994643*Math.sin(2*d))%360*s,r=(23.439291-.0130042*n)*s,c=1.000140612-.016708617*Math.cos(d)-139589e-9*Math.cos(2*d),h=[c*Math.cos(i),c*Math.cos(r)*Math.sin(i),c*Math.sin(r)*Math.sin(i)],m=Math.atan(Math.cos(r)*Math.tan(i)),l=m;return Math.abs(i-l)>.5*t&&(l+=.5*t*Math.round((i-m)/(.5*t))),{rsun:h,rtasc:l,decl:Math.asin(Math.sin(r)*Math.sin(i))}}},w),{SatRecError:o});return _}));

// Check if satellite library loaded correctly
if (typeof satellite === 'undefined') {
    console.error('satellite.js library not loaded properly');
    throw new Error('satellite.js library not loaded');
}

// Cache for satellite records to improve performance
const satrecCache = new Map();

// Listen for messages from main thread
self.onmessage = function(e) {
    console.log('Calculation worker received:', e.data.type);
    const { type, data, messageId } = e.data;
    
    try {
        switch (type) {
            case 'CALCULATE_TRANSITS':
                const transits = calculateTransits(data.tle_line1, data.tle_line2, data.observer, data.startTime, data.durationDays, data.visibilityArray);
                self.postMessage({ type: 'TRANSITS_RESULT', data: { transits }, messageId });
                break;

            case 'CALCULATE_TRANSITS_ARRAY':
                const transitResults = calculateTransitsArray(data.satellites, data.observer, data.startTime, data.durationDays, data.visibilityArray, data.minElevationDegrees);
                self.postMessage({ type: 'TRANSITS_ARRAY_RESULT', data: { results: transitResults }, messageId });
                break;

            case 'CALCULATE_INTERFERENCE':
                const events = calculateInterference(data);
                self.postMessage({ type: 'INTERFERENCE_RESULT', data: { events }, messageId });
                break;

            case 'CLEAR_CACHE':
                satrecCache.clear();
                self.postMessage({ type: 'CACHE_CLEARED', data: { cacheSize: 0 }, messageId });
                break;

            default:
                throw new Error('Unknown calculation type: ' + type);
        }
    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({ type: 'ERROR', data: { error: error.message }, messageId });
    }
};

// Determine visibility using the pre-calculated array
function getVisibility(time, visibilityArray) {
    if (!visibilityArray || visibilityArray.length !== 288) {
        return 'Unknown';
    }

    const t = new Date(time);
    // Get the time in minutes since midnight UTC
    const tMinutes = t.getUTCHours() * 60 + t.getUTCMinutes();

    // Convert to array index (each slot is 5 minutes)
    const index = Math.floor(tMinutes / 5);

    // Bounds check
    if (index < 0 || index >= 288) {
        return 'Unknown';
    }

    return visibilityArray[index];
}

// Check if satellite is sunlit (not in Earth's shadow)
function isSatelliteSunlit(satellitePositionEci, time) {
    // Get sun position at the given time
    const julianDate = satellite.jday(time);
    const sunData = satellite.sunPos(julianDate);

    // Convert sun position from AU to km (1 AU = 149597870.7 km)
    const AU_TO_KM = 149597870.7;
    const sunPositionEci = {
        x: sunData.rsun[0] * AU_TO_KM,
        y: sunData.rsun[1] * AU_TO_KM,
        z: sunData.rsun[2] * AU_TO_KM
    };

    // Earth radius in km
    const EARTH_RADIUS = 6371.0;

    // Vector from sun to satellite
    const sunToSat = {
        x: satellitePositionEci.x - sunPositionEci.x,
        y: satellitePositionEci.y - sunPositionEci.y,
        z: satellitePositionEci.z - sunPositionEci.z
    };

    // Distance from sun to satellite
    const sunToSatDist = Math.sqrt(sunToSat.x ** 2 + sunToSat.y ** 2 + sunToSat.z ** 2);

    // Normalized sun-to-satellite vector
    const sunToSatNorm = {
        x: sunToSat.x / sunToSatDist,
        y: sunToSat.y / sunToSatDist,
        z: sunToSat.z / sunToSatDist
    };

    // Project Earth center onto sun-satellite line
    const dotProduct = -(sunPositionEci.x * sunToSatNorm.x +
                         sunPositionEci.y * sunToSatNorm.y +
                         sunPositionEci.z * sunToSatNorm.z);

    // If projection is negative or beyond satellite, satellite is not in shadow
    if (dotProduct < 0 || dotProduct > sunToSatDist) {
        return true; // Sunlit
    }

    // Distance from Earth center to the projected point
    const closestPoint = {
        x: sunPositionEci.x + dotProduct * sunToSatNorm.x,
        y: sunPositionEci.y + dotProduct * sunToSatNorm.y,
        z: sunPositionEci.z + dotProduct * sunToSatNorm.z
    };

    const distToLine = Math.sqrt(
        closestPoint.x ** 2 +
        closestPoint.y ** 2 +
        closestPoint.z ** 2
    );

    // If distance to line is greater than Earth radius, satellite is not in shadow
    return distToLine > EARTH_RADIUS;
}

// Check if sun is behind observer (good viewing) or in front (sun in eyes - bad viewing)
// Returns: 'behind' (good), 'front' (bad), or null if satellite not sunlit
function getSunOrientation(satellitePositionEci, observerEcf, time) {
    // First check if satellite is sunlit
    if (!isSatelliteSunlit(satellitePositionEci, time)) {
        return null; // Satellite in shadow, sun orientation irrelevant
    }

    // Get sun position
    const julianDate = satellite.jday(time);
    const sunData = satellite.sunPos(julianDate);
    const gmst = satellite.gstime(time);

    // Convert sun position from AU to km (1 AU = 149597870.7 km)
    const AU_TO_KM = 149597870.7;
    const sunPositionEci = {
        x: sunData.rsun[0] * AU_TO_KM,
        y: sunData.rsun[1] * AU_TO_KM,
        z: sunData.rsun[2] * AU_TO_KM
    };
    const sunPositionEcf = satellite.eciToEcf(sunPositionEci, gmst);

    // Vector from observer to satellite (in ECF)
    const satPositionEcf = satellite.eciToEcf(satellitePositionEci, gmst);
    const obsToSat = {
        x: satPositionEcf.x - observerEcf.x,
        y: satPositionEcf.y - observerEcf.y,
        z: satPositionEcf.z - observerEcf.z
    };

    // Vector from observer to sun (in ECF)
    const obsToSun = {
        x: sunPositionEcf.x - observerEcf.x,
        y: sunPositionEcf.y - observerEcf.y,
        z: sunPositionEcf.z - observerEcf.z
    };

    // Normalize both vectors
    const obsToSatMag = Math.sqrt(obsToSat.x ** 2 + obsToSat.y ** 2 + obsToSat.z ** 2);
    const obsToSunMag = Math.sqrt(obsToSun.x ** 2 + obsToSun.y ** 2 + obsToSun.z ** 2);

    const obsToSatNorm = {
        x: obsToSat.x / obsToSatMag,
        y: obsToSat.y / obsToSatMag,
        z: obsToSat.z / obsToSatMag
    };

    const obsToSunNorm = {
        x: obsToSun.x / obsToSunMag,
        y: obsToSun.y / obsToSunMag,
        z: obsToSun.z / obsToSunMag
    };

    // Dot product: positive = same direction (sun in front), negative = opposite (sun behind)
    const dotProduct = obsToSatNorm.x * obsToSunNorm.x +
                      obsToSatNorm.y * obsToSunNorm.y +
                      obsToSatNorm.z * obsToSunNorm.z;

    // If dot product < 0, sun is generally behind observer (good viewing)
    // If dot product > 0, sun is in front of observer (sun in eyes - bad)
    return dotProduct < 0 ? 'behind' : 'front';
}

// Get or create a satellite record from cache
function getSatrec(line1, line2, satelliteId = null) {
    const cacheKey = `${line1}_${line2}`;
    
    if (satrecCache.has(cacheKey)) {
        return satrecCache.get(cacheKey);
    }
    
    try {
        const satrec = satellite.twoline2satrec(line1, line2);
        if (satrec) {
            satrecCache.set(cacheKey, satrec);
            return satrec;
        }
    } catch (error) {
        console.warn(`Failed to parse TLE for satellite ${satelliteId}:`, error);
    }
    
    return null;
}

// Calculate satellite transits for the specified time period
function calculateTransits(tle_line1, tle_line2, observer, startTime, durationDays, visibilityArray) {
    //console.log('calculateTransits called with:', {
    //    tle_line1,
    //    tle_line2,
    //    observer,
    //    startTime,
    //    durationDays,
    //    visibilityArray: visibilityArray ? `Array of ${visibilityArray.length} entries` : 'None'
    //});

    const transits = [];
    const endTime = new Date(startTime.getTime() + (durationDays * 24 * 60 * 60 * 1000));
    
    // Validate TLE lines
    if (!tle_line1 || !tle_line2) {
        throw new Error('No valid TLE data provided');
    }
    
    // Create satellite record from TLE data
    const satrec = getSatrec(tle_line1, tle_line2);
    
    if (!satrec) {
        throw new Error('Failed to parse TLE data');
    }
    
    const observerGd = {
        longitude: satellite.degreesToRadians(observer.lng),
        latitude: satellite.degreesToRadians(observer.lat),
        height: observer.alt / 1000 // Convert to km
    };
    
    let currentTime = new Date(startTime);
    let lastElevation = null;
    let transitInProgress = false;
    let transitStart = null;
    let transitPeak = null;
    let peakElevation = -90;
    
    // Step through time in 1-minute intervals
    while (currentTime <= endTime) {
        const positionAndVelocity = satellite.propagate(satrec, currentTime);

        if (!positionAndVelocity || positionAndVelocity.error) {
            console.warn("propagate() error ", currentTime, tle_line1, tle_line2);
            return transits;
        }
        const positionEci = positionAndVelocity.position;
        const gmst = satellite.gstime(currentTime);

        // Debug logging for ISS during specific time window
        /* {
            const debugStart = new Date('2025-09-19T16:57:00Z');
            const debugEnd = new Date('2025-09-19T17:01:55Z');
            const isISS = tle_line1.includes('25544') || tle_line1.includes('ISS');
            const isInDebugWindow = currentTime >= debugStart && currentTime <= debugEnd;

            if (isISS && isInDebugWindow) {
                console.log(`\n=== ISS DEBUG at ${currentTime.toISOString()} ===`);
                console.log('TEME Position (km):', {
                    x: positionEci.x,
                    y: positionEci.y,
                    z: positionEci.z
                });
                console.log('GMST:', gmst);
            }
        }
        */
        const positionEcf = satellite.eciToEcf(positionEci, gmst);
        const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

        const elevationDeg = satellite.radiansToDegrees(lookAngles.elevation);
        const azimuthDeg = satellite.radiansToDegrees(lookAngles.azimuth);

        /*
        if (isISS && isInDebugWindow) {
            console.log('ECF Position (km):', {
                x: positionEcf.x,
                y: positionEcf.y,
                z: positionEcf.z
            });
            console.log('Observer (lat/lng/alt):', {
                lat: satellite.radiansToDegrees(observerGd.latitude),
                lng: satellite.radiansToDegrees(observerGd.longitude),
                alt: observerGd.height * 1000 // Convert back to meters for display
            });
            console.log('Look Angles:', {
                elevation: elevationDeg.toFixed(2) + '°',
                azimuth: azimuthDeg.toFixed(2) + '°',
                range: lookAngles.rangeSat ? (lookAngles.rangeSat + ' km') : 'N/A'
            });
            console.log('Above horizon?', elevationDeg > 0 ? 'YES' : 'NO');
        }
        */
        
        // Check for transit start (elevation goes above 0)
        if (!transitInProgress && elevationDeg > 0 && (lastElevation === null || lastElevation <= 0)) {
            transitInProgress = true;
            transitStart = {
                time: new Date(currentTime),
                elevation: elevationDeg,
                azimuth: azimuthDeg
            };
            transitPeak = { ...transitStart };
            peakElevation = elevationDeg;

            /* if (isISS) {
                console.log('>>> TRANSIT START DETECTED!', {
                    time: transitStart.time.toISOString(),
                    timeLocal: transitStart.time.toLocaleString(),
                    elevation: transitStart.elevation.toFixed(2) + '°',
                    azimuth: transitStart.azimuth.toFixed(2) + '°'
                });
            } */
        }

        // Track peak elevation during transit
        if (transitInProgress && elevationDeg > peakElevation) {
            peakElevation = elevationDeg;
            transitPeak = {
                time: new Date(currentTime),
                elevation: elevationDeg,
                azimuth: azimuthDeg
            };

            /* if (isISS && isInDebugWindow) {
                console.log('>>> NEW PEAK:', {
                    time: transitPeak.time.toISOString(),
                    elevation: transitPeak.elevation.toFixed(2) + '°',
                    azimuth: transitPeak.azimuth.toFixed(2) + '°'
                });
            } */
        }

        // Check for transit end (elevation goes below 0)
        if (transitInProgress && elevationDeg <= 0 && lastElevation > 0) {
            transitInProgress = false;

            /* if (isISS && isInDebugWindow) {
                console.log('>>> TRANSIT END DETECTED!', {
                    time: currentTime.toISOString(),
                    peakElevation: peakElevation.toFixed(2) + '°',
                    willRecord: peakElevation >= 1 ? 'YES' : 'NO'
                });
            } */

            // Only record transits with reasonable peak elevation
            if (peakElevation >= 1) {
                // Calculate visibility for the peak time
                const visibility = (visibilityArray ? getVisibility(transitPeak.time, visibilityArray) : null);

                // Get satellite position at peak time for sunlit check
                const peakPosVel = satellite.propagate(satrec, transitPeak.time);
                const peakPosEci = peakPosVel.position;

                // Check if satellite is sunlit at peak
                const isSunlit = isSatelliteSunlit(peakPosEci, transitPeak.time);

                // Check sun orientation (only if sunlit)
                const observerEcf = satellite.geodeticToEcf(observerGd);
                const sunOrientation = isSunlit ? getSunOrientation(peakPosEci, observerEcf, transitPeak.time) : null;

                const transitData = {
                    startTime: transitStart.time.toISOString(),
                    startElevation: transitStart.elevation,
                    startAzimuth: transitStart.azimuth,
                    peakTime: transitPeak.time.toISOString(),
                    peakElevation: transitPeak.elevation,
                    peakAzimuth: transitPeak.azimuth,
                    endTime: currentTime.toISOString(),
                    endElevation: elevationDeg,
                    endAzimuth: azimuthDeg,
                    visibility: visibility,
                    isSunlit: isSunlit,
                    sunOrientation: sunOrientation  // 'behind', 'front', or null
                };

                /* if (isISS) {
                    console.log('>>> ADDING ISS TRANSIT TO RESULTS:', {
                        startTime: transitData.startTime,
                        peakTime: transitData.peakTime,
                        endTime: transitData.endTime,
                        peakElevation: transitData.peakElevation.toFixed(2) + '°'
                    });
                } */

                transits.push(transitData);
            }
            
            // Reset for next transit
            transitStart = null;
            transitPeak = null;
            peakElevation = -90;
        }
        
        lastElevation = elevationDeg;
        currentTime = new Date(currentTime.getTime() + 60000); // Add 1 minute
    }
    
    // Sort transits by start time
    transits.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    return transits;
}

// Calculate transits for an array of satellites
function calculateTransitsArray(satellites, observer, startTime, durationDays, visibilityArray, minElevationDegrees = 0) {
    console.log('calculateTransitsArray called with:', {
        satelliteCount: satellites.length,
        observer,
        startTime,
        durationDays,
        minElevationDegrees
    });

    const results = {};
    const totalSatellites = satellites.length;

    // Process each satellite
    for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        const { noradId, tle_line1, tle_line2 } = sat;

        // Send progress update
        const progress = Math.round((i / totalSatellites) * 100);
        self.postMessage({
            type: 'PROGRESS_UPDATE',
            data: {
                progress: progress,
                current: i,
                total: totalSatellites,
                currentNoradId: noradId
            }
        });

        if (!tle_line1 || !tle_line2) {
            console.warn(`Skipping satellite ${noradId} - missing TLE data`);
            continue;
        }

        try {
            // Calculate transits for this satellite
            const allTransits = calculateTransits(tle_line1, tle_line2, observer, startTime, durationDays, visibilityArray);

            // Filter by minimum elevation
            const filteredTransits = allTransits.filter(transit => {
                return transit.peakElevation >= minElevationDegrees;
            });

            // Store results by NORAD ID
            if (filteredTransits.length > 0) {
                results[noradId] = filteredTransits;
            }
        } catch (error) {
            console.error(`Error calculating transits for satellite ${noradId}:`, error);
        }
    }

    // Send final progress update
    self.postMessage({
        type: 'PROGRESS_UPDATE',
        data: {
            progress: 100,
            current: totalSatellites,
            total: totalSatellites
        }
    });

    console.log(`Processed ${satellites.length} satellites, found transits for ${Object.keys(results).length} satellites`);

    return results;
}

// Calculate interference events using the optimized 60-minute chunk approach
function calculateInterference(params) {
    const {
        observerLat,
        observerLng, 
        observerAlt,
        allSatellites,
        targetSatelliteData,
        targetOe,
        timeRangeHours,
        thresholdArcSec,
        isBackward,
        chunkMinutes = 60,
        minimumElevationDeg = 10
    } = params;
   
    console.log("I AM ALIVE");
    // Clear cache on each calculation to avoid stale results
    satrecCache.clear();
    
    const events = [];
    const now = new Date();
    let startTime, endTime;
    
    if (isBackward) {
        startTime = new Date(now.getTime() - (timeRangeHours * 60 * 60 * 1000));
        endTime = now;
    } else {
        startTime = now;
        endTime = new Date(now.getTime() + (timeRangeHours * 60 * 60 * 1000));
    }
    
    const thresholdDegrees = thresholdArcSec / 3600;
    console.log(`Worker: Interference threshold: ${thresholdArcSec} arc-seconds = ${thresholdDegrees.toFixed(6)} degrees`);
    
    // Parse target satellite TLE
    let targetLine1, targetLine2;
    if (targetSatelliteData.tleData && targetSatelliteData.tleData.raw_tle) {
        targetLine1 = targetSatelliteData.tleData.raw_tle.tle_line1;
        targetLine2 = targetSatelliteData.tleData.raw_tle.tle_line2;
    } else if (targetOe.tle_line1 && targetOe.tle_line2) {
        targetLine1 = targetOe.tle_line1;
        targetLine2 = targetOe.tle_line2;
    } else {
        throw new Error('No valid TLE data for target satellite');
    }
    
    const targetSatrec = getSatrec(targetLine1, targetLine2, targetSatelliteData.norad_id);
    if (!targetSatrec) {
        throw new Error('Failed to parse target satellite TLE');
    }
    
    // Observer position
    const observerGd = {
        longitude: satellite.degreesToRadians(observerLng),
        latitude: satellite.degreesToRadians(observerLat),  
        height: observerAlt / 1000 // km
    };
    console.warn("observer", observerGd);
    
    // Filter to internet constellation satellites only (for RF interference)
    const internetSatellites = allSatellites.filter(sat => {
        // Skip target satellite
        if (sat.norad_id === targetSatelliteData.norad_id) return false;
        
        // Only internet constellations
        return isInternetConstellation(sat.sat_name);
    });
    
    console.log(`Worker: Total satellites: ${allSatellites.length}, Internet constellation satellites: ${internetSatellites.length}`);
    
    // Calculate time chunks with 5-minute overlap for safety
    const chunkDurationMs = chunkMinutes * 60 * 1000;
    const overlapMs = 5 * 60 * 1000; // 5 minutes
    const chunks = [];
    let chunkStart = new Date(startTime);
    
    while (chunkStart < endTime) {
        const chunkEnd = new Date(Math.min(chunkStart.getTime() + chunkDurationMs, endTime.getTime()));
        chunks.push({ start: chunkStart, end: chunkEnd });
        chunkStart = new Date(chunkEnd);
    }
    
    console.log(`Worker: Processing ${chunks.length} time chunks of ${chunkMinutes} minutes each`);
    
    // Process each chunk
    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
        const chunk = chunks[chunkIdx];
        
        // Send progress update at start of each chunk
        const chunkProgress = Math.min(5 + Math.round((chunkIdx / chunks.length) * 90), 99);
        self.postMessage({
            type: 'PROGRESS_UPDATE',
            data: { progress: chunkProgress }
        });
        
        try {
            let chunkEvents = 0;
            let processedInChunk = 0;
            let skippedInChunk = 0;
            
            // Process satellites
            for (let satIdx = 0; satIdx < internetSatellites.length; satIdx++) {
                try {
                    const sat = internetSatellites[satIdx];
                    processedInChunk++;
                    
            
            // Get or create satrec
            let line1, line2;
            if (sat.tleData && sat.tleData.raw_tle) {
                line1 = sat.tleData.raw_tle.tle_line1;
                line2 = sat.tleData.raw_tle.tle_line2;
            } else if (sat.tle_line1 && sat.tle_line2) {
                line1 = sat.tle_line1;
                line2 = sat.tle_line2;
            } else {
                skippedInChunk++;
                if (chunkIdx === 0 && skippedInChunk <= 3) {
                    console.log(`Worker: Skipped ${sat.sat_name} - no TLE data`);
                }
                continue; // Skip satellites without TLE
            }
            
            const candidateSatrec = getSatrec(line1, line2, sat.norad_id);
            if (!candidateSatrec) {
                skippedInChunk++;
                if (chunkIdx === 0 && skippedInChunk <= 3) {
                    console.log(`Worker: Skipped ${sat.sat_name} - failed to parse TLE`);
                }
                continue;
            }
            
            // Find minimum separation in this time chunk (with fixed working algorithm)
            const minResult = findMinimumSeparationOptimized(
                targetSatrec,
                candidateSatrec, 
                observerGd,
                chunk.start,
                chunk.end,
                thresholdDegrees
            );
            
            if (!minResult) continue;
            
            // Check if this qualifies as an interference event
            if (minResult.separation <= thresholdDegrees && minResult.isInterfererCloser) {
                // Also check that the interferer is reasonably high in the sky
                const interferencePos = getSatellitePosition(targetSatrec, { satrec: candidateSatrec }, observerGd, minResult.time);
                if (interferencePos && interferencePos.candidateEl > minimumElevationDeg) {
                    chunkEvents++;
                    events.push({
                        startTime: minResult.startTime,
                        peakTime: minResult.time,
                        endTime: minResult.endTime,
                        duration: minResult.duration || 0,
                        interfererName: sat.sat_name || `NORAD ${sat.norad_id}`,
                        minSeparationDeg: minResult.separation,
                        minSeparationArcSec: minResult.separation * 3600,
                        interfererRange: minResult.range,
                        angularVelocityArcSecPerSec: minResult.angularVelocityArcSecPerSec || 0
                    });
                }
            }
                } catch (satError) {
                    console.error(`Worker: Error processing satellite ${sat?.sat_name || satIdx}:`, satError);
                    skippedInChunk++;
                }
            }
            
            
        } catch (chunkError) {
            console.error(`Worker: Error processing chunk ${chunkIdx + 1}:`, chunkError);
        }
    }
    
    // Sort events by start time
    events.sort((a, b) => a.startTime - b.startTime);
    
    console.log(`Worker: Found ${events.length} interference events using 60-minute chunk approach`);
    
    return events;
}

// Check if satellite belongs to an internet constellation
function isInternetConstellation(satName) {
    if (!satName) return false;
    
    const name = satName.toUpperCase();
    
    // Starlink
    if (name.includes('STARLINK')) return true;
    
    // OneWeb
    if (name.includes('ONEWEB')) return true;
    
    // Amazon Kuiper
    if (name.includes('KUIPER') || name.includes('AMAZON')) return true;
    
    // Other potential constellations
    if (name.includes('PLANET') || name.includes('DOVES')) return true;
    if (name.includes('GLOBALSTAR')) return true;
    if (name.includes('IRIDIUM') && name.includes('NEXT')) return true;
    
    return false;
}

// FIXED: Working optimized ternary search implementation from main thread
function findMinimumSeparationOptimized(targetSatrec, candidateSatrec, observerGd, startTime, endTime, thresholdDegrees) {
    const tolerance = 1000; // 1 second precision
    let left = startTime.getTime();
    let right = endTime.getTime();
    
    // Cache for target satellite positions
    const targetCache = new Map();
    
    // Helper to get cached target position
    const getCachedTargetPosition = (time) => {
        const timeKey = time.getTime();
        if (targetCache.has(timeKey)) {
            return targetCache.get(timeKey);
        }
        
        const targetPosVel = satellite.propagate(targetSatrec, time);
        if (!targetPosVel || !targetPosVel.position || targetPosVel.error) {
            return null;
        }
        
        const gmst = satellite.gstime(time);
        const targetEcf = satellite.eciToEcf(targetPosVel.position, gmst);
        const targetLook = satellite.ecfToLookAngles(observerGd, targetEcf);
        
        if (!targetLook || targetLook.azimuth === undefined || targetLook.elevation === undefined) {
            return null;
        }
        
        const result = {
            targetAz: satellite.radiansToDegrees(targetLook.azimuth),
            targetEl: satellite.radiansToDegrees(targetLook.elevation),
            targetRange: targetLook.rangeSat || 0,
            gmst: gmst
        };
        
        targetCache.set(timeKey, result);
        return result;
    };
    
    // Optimized separation calculation that reuses target position
    const calculateSeparationOptimized = (time, detailed = false) => {
        const targetData = getCachedTargetPosition(time);
        if (!targetData) {
            return detailed ? null : 180;
        }
        
        // Only calculate candidate position
        const candidatePosVel = satellite.propagate(candidateSatrec, time);
        if (!candidatePosVel || !candidatePosVel.position || candidatePosVel.error) {
            return detailed ? null : 180;
        }
        
        const candidateEcf = satellite.eciToEcf(candidatePosVel.position, targetData.gmst);
        const candidateLook = satellite.ecfToLookAngles(observerGd, candidateEcf);
        
        if (!candidateLook || candidateLook.azimuth === undefined || candidateLook.elevation === undefined) {
            return detailed ? null : 180;
        }
        
        const candidateAz = satellite.radiansToDegrees(candidateLook.azimuth);
        const candidateEl = satellite.radiansToDegrees(candidateLook.elevation);
        const candidateRange = candidateLook.rangeSat || 0;
        
        const separation = calculateAngularSeparation(
            targetData.targetAz, targetData.targetEl,
            candidateAz, candidateEl
        );
        
        if (detailed) {
            return {
                time: time,
                separation: separation,
                isInterfererCloser: candidateRange < targetData.targetRange,
                range: candidateRange,
                targetRange: targetData.targetRange,
                candidateEl: candidateEl,
                candidateAz: candidateAz,
                targetAz: targetData.targetAz,
                targetEl: targetData.targetEl
            };
        } else {
            return separation;
        }
    };
    
    // Ternary search for minimum
    while (right - left > tolerance) {
        const mid1 = left + (right - left) / 3;
        const mid2 = right - (right - left) / 3;
        
        const sep1 = calculateSeparationOptimized(new Date(mid1));
        const sep2 = calculateSeparationOptimized(new Date(mid2));
        
        if (sep1 > sep2) {
            left = mid1;
        } else {
            right = mid2;
        }
    }
    
    const minTime = new Date((left + right) / 2);
    const minResult = calculateSeparationOptimized(minTime, true);
    
    if (!minResult) return null;
    
    // Calculate angular velocity using cached target positions
    const deltaMs = 100;
    const time1 = new Date(minTime.getTime() - deltaMs/2);
    const time2 = new Date(minTime.getTime() + deltaMs/2);
    
    const result1 = calculateSeparationOptimized(time1, true);
    const result2 = calculateSeparationOptimized(time2, true);
    
    if (!result1 || !result2) {
        return {
            ...minResult,
            startTime: minTime,
            endTime: minTime,
            duration: 0
        };
    }
    
    // Calculate angular velocity based on candidate movement
    let azChange = Math.abs(result2.candidateAz - result1.candidateAz);
    if (azChange > 180) {
        azChange = 360 - azChange;
    }
    const elChange = Math.abs(result2.candidateEl - result1.candidateEl);
    
    const angularMovement = Math.sqrt(azChange * azChange + elChange * elChange);
    const timeChange = deltaMs / 1000;
    const angularVelocityDegPerSec = angularMovement / timeChange;
    
    // Calculate duration
    if (minResult.separation > thresholdDegrees) {
        return {
            ...minResult,
            startTime: minTime,
            endTime: minTime, 
            duration: 0,
            angularVelocityDegPerSec: angularVelocityDegPerSec
        };
    }
    
    let durationSeconds = 0;
    if (angularVelocityDegPerSec > 0) {
        const interferenceWidth = 2 * (thresholdDegrees - minResult.separation);
        durationSeconds = interferenceWidth / angularVelocityDegPerSec;
    }
    
    const durationMs = Math.max(1, Math.round(durationSeconds * 1000));
    const halfDuration = durationMs / 2;
    const eventStartTime = new Date(minTime.getTime() - halfDuration);
    const eventEndTime = new Date(minTime.getTime() + halfDuration);
    
    return {
        ...minResult,
        startTime: eventStartTime,
        endTime: eventEndTime,
        duration: durationMs,
        angularVelocityDegPerSec: angularVelocityDegPerSec,
        angularVelocityArcSecPerSec: angularVelocityDegPerSec * 3600
    };
}

// Helper function to calculate angular separation
function calculateAngularSeparation(az1, el1, az2, el2) {
    const az1Rad = degreesToRadians(az1);
    const el1Rad = degreesToRadians(el1);
    const az2Rad = degreesToRadians(az2);
    const el2Rad = degreesToRadians(el2);
    
    const separation = Math.acos(
        Math.sin(el1Rad) * Math.sin(el2Rad) +
        Math.cos(el1Rad) * Math.cos(el2Rad) * Math.cos(az1Rad - az2Rad)
    );
    
    return radiansToDegrees(separation);
}

// Get satellite position and calculate angular separation
function getSatellitePosition(targetSatrec, candidate, observerGd, time) {
    try {
        // Propagate target satellite
        const targetPV = satellite.propagate(targetSatrec, time);
        if (targetPV.error || !targetPV.position) return null;
        
        // Propagate candidate satellite
        const candidatePV = satellite.propagate(candidate.satrec, time);
        if (candidatePV.error || !candidatePV.position) return null;
        
        const gmst = satellite.gstime(time);
        
        // Convert to ECF
        const targetEcf = satellite.eciToEcf(targetPV.position, gmst);
        const candidateEcf = satellite.eciToEcf(candidatePV.position, gmst);
        
        // Get look angles
        const targetLook = satellite.ecfToLookAngles(observerGd, targetEcf);
        const candidateLook = satellite.ecfToLookAngles(observerGd, candidateEcf);
        
        // Calculate angular separation using spherical law of cosines
        const targetEl = targetLook.elevation;
        const targetAz = targetLook.azimuth;
        const candidateEl = candidateLook.elevation;
        const candidateAz = candidateLook.azimuth;
        
        const angularSeparation = Math.acos(
            Math.sin(targetEl) * Math.sin(candidateEl) +
            Math.cos(targetEl) * Math.cos(candidateEl) * Math.cos(targetAz - candidateAz)
        );
        
        return {
            targetEl: satellite.radiansToDegrees(targetEl),
            targetAz: satellite.radiansToDegrees(targetAz),
            targetRange: targetLook.rangeSat,
            candidateEl: satellite.radiansToDegrees(candidateEl),
            candidateAz: satellite.radiansToDegrees(candidateAz),
            candidateRange: candidateLook.rangeSat,
            separation: satellite.radiansToDegrees(angularSeparation)
        };
    } catch (error) {
        return null;
    }
}

// Convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Convert radians to degrees
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

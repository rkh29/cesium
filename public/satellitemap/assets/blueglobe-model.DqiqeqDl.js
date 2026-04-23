class pt{constructor(t,o){this.gl=t,this.twgl=o,this.modelCache=new Map,this.models=[],this.activeModelIndex=null,this.pbrProgram=null,this.simpleProgram=null,this.defaultTransform={position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]}}async loadModel(t,o=null){const i=performance.now();if(this.modelCache.has(t)){const l=this.modelCache.get(t);return this.models[0]=l,0}try{const l=await fetch(t);if(!l.ok)throw new Error(`Failed to load model: ${l.statusText}`);const a=await l.arrayBuffer(),n=performance.now()-i,r=await this.parseGLB(a,t);t.includes("ISS_stationary")&&this._reparentISSPanels(r),t.includes("orion")&&this._setupOrionPanels(r),this.modelCache.set(t,r),this.models[0]=r;const c=0,s=performance.now()-i;return this.performPostLoadDiagnostics(c,t,a.byteLength,n,s,o),c}catch(l){throw console.error("Error loading GLB model:",l),o&&o("model_load_error",{url:t,error:l.message,userAgent:navigator.userAgent,maxTextureSize:this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),contextLost:this.gl.isContextLost()}),l}}performPostLoadDiagnostics(t,o,i,l,a,n){const r=this.gl,c=this.models[t],s={meshCount:c.meshes.length,nodeCount:c.nodes.length,materialCount:c.materials.length,textureCount:c.textures.size,maxTextureSize:r.getParameter(r.MAX_TEXTURE_SIZE),maxRenderbufferSize:r.getParameter(r.MAX_RENDERBUFFER_SIZE),maxVertexAttribs:r.getParameter(r.MAX_VERTEX_ATTRIBS),contextLost:r.isContextLost(),glError:r.getError(),jsHeapSize:performance.memory?performance.memory.usedJSHeapSize:null,jsHeapLimit:performance.memory?performance.memory.jsHeapSizeLimit:null};let u=0,m=0,d=0;c.meshes.forEach(e=>{e.primitives.forEach(p=>{u++,m+=p.bufferInfo.numElements,p.bufferInfo.indices&&(d+=p.bufferInfo.numElements)})}),s.totalPrimitives=u,s.totalVertices=m,s.totalIndices=d;const f=[];c.textures.forEach((e,p)=>{r.isTexture(e)||f.push(`Texture ${p} is not a valid WebGL texture`)}),f.length>0&&(s.textureIssues=f),console.log("Model loaded successfully:",{name:o.split("/").pop(),fileSize:`${(i/1024).toFixed(1)} KB`,loadTime:`${l.toFixed(0)}ms`,totalTime:`${a.toFixed(0)}ms`,meshes:s.meshCount,primitives:u,vertices:m,textures:s.textureCount,maxTextureSize:s.maxTextureSize})}async parseGLB(t,o){const i=new DataView(t),l=i.getUint32(0,!0),a=i.getUint32(4,!0);if(i.getUint32(8,!0),l!==1179937895)throw new Error("Invalid GLB file");if(a!==2)throw new Error("Unsupported GLB version");let n=12;const r=i.getUint32(n,!0);if(i.getUint32(n+4,!0)!==1313821514)throw new Error("Expected JSON chunk");const s=new Uint8Array(t,n+8,r),u=new TextDecoder().decode(s),m=JSON.parse(u);n+=8+r;let d=null;if(n<t.byteLength){const e=i.getUint32(n,!0);i.getUint32(n+4,!0)===5130562&&(d=new ArrayBuffer(e),new Uint8Array(d).set(new Uint8Array(t,n+8,e)))}return await this.processGLTF(m,d,o)}async processGLTF(t,o,i){this.gl,this.twgl,this.initShaders();const l={gltf:t,buffers:[],textures:new Map,meshes:[],nodes:t.nodes||[],materials:t.materials||[],baseUrl:i};if(t.buffers)for(let a=0;a<t.buffers.length;a++){const n=t.buffers[a];if(a===0&&o)l.buffers[a]=o;else if(n.uri){const r=new URL(n.uri,i).href,c=await fetch(r);l.buffers[a]=await c.arrayBuffer()}}if(l.bufferViews=t.bufferViews||[],l.accessors=t.accessors||[],t.textures)for(let a=0;a<t.textures.length;a++){const n=t.textures[a],r=await this.loadTexture(n,t,l);l.textures.set(a,r)}if(t.meshes)for(const a of t.meshes){const n=this.processMesh(a,l);l.meshes.push(n)}return this.analyzeMaterialsForReflections(l),l}analyzeMaterialsForReflections(t){const o=[];t.materials.forEach((i,l)=>{const a={index:l,name:i.name||`Material_${l}`,isReflective:!1,reflectiveProperties:{}};if(i.pbrMetallicRoughness){const r=i.pbrMetallicRoughness,c=r.metallicFactor!==void 0?r.metallicFactor:1,s=r.roughnessFactor!==void 0?r.roughnessFactor:1;if((c>.5||s<.5)&&(a.isReflective=!0,a.reflectiveProperties={metallic:c,roughness:s,shininess:(1-s)*c,type:c>.8?"metallic":"glossy"}),r.baseColorFactor){const[u,m,d]=r.baseColorFactor;u<.3&&m<.3&&d<.5&&(a.reflectiveProperties.possibleSolarPanel=!0)}}const n=a.name.toLowerCase();(n.includes("panel")||n.includes("solar")||n.includes("shiny")||n.includes("metal")||n.includes("foil"))&&(a.isReflective=!0,a.reflectiveProperties.nameHint=n),a.isReflective&&o.push(a)}),console.log("Reflective materials found:",o),t.reflectiveMaterials=o,t.isReflectiveMaterial=new Set(o.map(i=>i.index))}async loadTexture(t,o,i){const l=this.gl,a=this.twgl;if(t.source!==void 0&&o.images&&o.images[t.source]){const n=o.images[t.source];if(n.uri){const r=new URL(n.uri,i.baseUrl).href;return a.createTexture(l,{src:r,flipY:!1})}else if(n.bufferView!==void 0){const r=i.bufferViews[n.bufferView],c=i.buffers[r.buffer],s=new Uint8Array(c,r.byteOffset||0,r.byteLength),u=new Blob([s],{type:n.mimeType}),m=URL.createObjectURL(u);return new Promise(d=>{const f=a.createTexture(l,{src:m,flipY:!1},()=>{URL.revokeObjectURL(m),d(f)})})}}return a.createTexture(l,{src:[255,255,255,255],width:1,height:1,flipY:!1})}processMesh(t,o){const i=this.gl,l=this.twgl,a={name:t.name,primitives:[]};for(const n of t.primitives){const r={};for(const[u,m]of Object.entries(n.attributes)){const d=o.accessors[m],f=o.bufferViews[d.bufferView],e=o.buffers[f.buffer],p=this.mapAttributeName(u),v=this.getTypedArrayConstructor(d.componentType),A=this.getElementSize(d.type),M=(f.byteOffset||0)+(d.byteOffset||0),T=v.BYTES_PER_ELEMENT,E=A*T,P=f.byteStride||E;let x;if(P!==E){x=new v(d.count*A);const S=new DataView(e);for(let h=0;h<d.count;h++){const y=M+h*P;for(let D=0;D<A;D++){const j=y+D*T;T===4?x[h*A+D]=S.getFloat32(j,!0):T===2?x[h*A+D]=S.getUint16(j,!0):x[h*A+D]=S.getUint8(j)}}}else x=new v(e,M,d.count*A);if(r[p]={data:x,numComponents:A},!this._debuggedPosition&&p==="position"&&x.length>0){const S=[1/0,1/0,1/0],h=[-1/0,-1/0,-1/0];for(let y=0;y<x.length;y+=3)S[0]=Math.min(S[0],x[y]),S[1]=Math.min(S[1],x[y+1]),S[2]=Math.min(S[2],x[y+2]),h[0]=Math.max(h[0],x[y]),h[1]=Math.max(h[1],x[y+1]),h[2]=Math.max(h[2],x[y+2]);console.log("Model bounds:",{min:S,max:h,center:[(S[0]+h[0])/2,(S[1]+h[1])/2,(S[2]+h[2])/2],size:[h[0]-S[0],h[1]-S[1],h[2]-S[2]],vertexCount:x.length/3}),this._debuggedPosition=!0}}if(n.indices!==void 0){const u=o.accessors[n.indices],m=o.bufferViews[u.bufferView],d=o.buffers[m.buffer],f=this.getTypedArrayConstructor(u.componentType),e=(m.byteOffset||0)+(u.byteOffset||0),p=u.count*f.BYTES_PER_ELEMENT;r.indices=new f(d.slice(e,e+p))}if(!r.texcoord&&!r.texcoord_0){const u=r.position.data.length/3;r.texcoord={data:new Float32Array(u*2),numComponents:2}}if(!r.normal){const u=r.position.data.length/3,m=new Float32Array(u*3);for(let d=0;d<u;d++)m[d*3+1]=1;r.normal={data:m,numComponents:3}}const s={bufferInfo:l.createBufferInfoFromArrays(i,r),materialIndex:n.material,material:n.material!==void 0?o.materials[n.material]:null,mode:n.mode!==void 0?n.mode:i.TRIANGLES};a.primitives.push(s)}return a}initShaders(){const t=this.gl,o=this.twgl,i=`
            attribute vec3 position;
            attribute vec3 normal;
            attribute vec2 texcoord;

            uniform mat4 u_worldViewProjection;
            uniform mat4 u_world;

            varying vec3 v_normal;
            varying vec2 v_texcoord;
            varying vec3 v_position;

            void main() {
                gl_Position = u_worldViewProjection * vec4(position, 1.0);

                // DEBUG: Force some vertices to be visible
                // if (gl_VertexID < 3) {
                //     gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
                // }

                v_normal = mat3(u_world) * normal;
                v_texcoord = texcoord;
                v_position = (u_world * vec4(position, 1.0)).xyz;

                // DEBUG output
                gl_PointSize = 10.0;
            }
        `,l=`
            precision mediump float;

            uniform vec4 u_baseColorFactor;
            uniform sampler2D u_baseColorTexture;
            uniform bool u_hasBaseColorTexture;
            uniform vec3 u_lightDirection;
            uniform vec3 u_viewPosition;
            uniform vec3 u_sunDirection;
            uniform float u_sunIntensity;

            varying vec3 v_normal;
            varying vec2 v_texcoord;
            varying vec3 v_position;

            void main() {
                vec4 baseColor = u_baseColorFactor;

                if (u_hasBaseColorTexture) {
                    baseColor *= texture2D(u_baseColorTexture, v_texcoord);
                }

                // Simple lighting
                vec3 normal = normalize(v_normal);
                vec3 lightDir = normalize(u_lightDirection);
                float NdotL = max(dot(normal, lightDir), 0.0);

                // Brighter lighting - more ambient, stronger diffuse
                vec3 ambient = 0.6 * baseColor.rgb;  // Increased from 0.3
                vec3 diffuse = 0.8 * baseColor.rgb * NdotL;  // Increased from 0.7

                // Add sun reflection/specular for shiny surfaces
                vec3 specular = vec3(0.0);

                // Calculate sun illumination for ALL surfaces
                vec3 sunDir = normalize(u_sunDirection);
                float sunLight = max(dot(normal, sunDir), 0.0);

                // Dark side gets only ambient light
                vec3 shadedColor = baseColor.rgb * (0.2 + 0.8 * sunLight);

                // Add specular reflection for reflective surfaces
                if (u_sunIntensity > 0.5) {
                    vec3 viewDir = normalize(u_viewPosition - v_position);
                    vec3 reflectDir = reflect(-sunDir, normal);

                    // Much lower power for VERY broad highlight
                    float dotProduct = max(dot(viewDir, reflectDir), 0.0);
                    float spec = pow(dotProduct, 2.0); // Very low power = very broad

                    // Also add a very broad base glow
                    float broadGlow = max(0.0, dotProduct); // Linear falloff, no power

                    // Add golden sun reflection on top of shaded surface
                    vec3 sunReflection = vec3(1.0, 0.9, 0.5) * (broadGlow + spec);

                    gl_FragColor = vec4(shadedColor + sunReflection * sunLight, 1.0); // Reflection only on lit side
                    return;

                    /*
                    vec3 viewDir = normalize(u_viewPosition - v_position);
                    vec3 sunDir = normalize(u_sunDirection);
                    vec3 reflectDir = reflect(-sunDir, normal);

                    // Lower power for broader highlights on solar panels
                    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);

                    // Bright white-yellow sun reflection
                    specular = vec3(1.0, 0.98, 0.8) * spec * u_sunIntensity * 1.5;
                    */
                }

                gl_FragColor = vec4(ambient + diffuse + specular, baseColor.a);
            }
        `;this.simpleProgram=o.createProgramInfo(t,[i,l]),this.simpleProgram.program||console.error("Failed to create simple shader program");const a=i,n=`
            precision mediump float;

            uniform vec4 u_baseColorFactor;
            uniform sampler2D u_baseColorTexture;
            uniform bool u_hasBaseColorTexture;

            uniform float u_metallicFactor;
            uniform float u_roughnessFactor;
            uniform sampler2D u_metallicRoughnessTexture;
            uniform bool u_hasMetallicRoughnessTexture;

            uniform sampler2D u_normalTexture;
            uniform bool u_hasNormalTexture;

            uniform vec3 u_lightDirection;
            uniform vec3 u_viewPosition;
            uniform vec3 u_sunDirection;
            uniform float u_sunIntensity;

            varying vec3 v_normal;
            varying vec2 v_texcoord;
            varying vec3 v_position;

            vec3 getNormal() {
                vec3 normal = normalize(v_normal);

                if (u_hasNormalTexture) {
                    vec3 tangentNormal = texture2D(u_normalTexture, v_texcoord).rgb * 2.0 - 1.0;
                    // Simplified normal mapping (would need tangent space in production)
                    normal = normalize(normal + tangentNormal * 0.5);
                }

                return normal;
            }

            void main() {
                vec4 baseColor = u_baseColorFactor;

                if (u_hasBaseColorTexture) {
                    baseColor *= texture2D(u_baseColorTexture, v_texcoord);
                }

                float metallic = u_metallicFactor;
                float roughness = u_roughnessFactor;

                if (u_hasMetallicRoughnessTexture) {
                    vec4 metallicRoughness = texture2D(u_metallicRoughnessTexture, v_texcoord);
                    metallic *= metallicRoughness.b;
                    roughness *= metallicRoughness.g;
                }

                vec3 normal = getNormal();
                vec3 sunDir = normalize(u_sunDirection);
                vec3 viewDir = normalize(u_viewPosition - v_position);
                vec3 halfVector = normalize(sunDir + viewDir);

                float NdotL = max(dot(normal, sunDir), 0.0);
                float NdotV = max(dot(normal, viewDir), 0.0);
                float NdotH = max(dot(normal, halfVector), 0.0);
                float VdotH = max(dot(viewDir, halfVector), 0.0);

                // PBR Cook-Torrance specular
                vec3 f0 = mix(vec3(0.04), baseColor.rgb, metallic);
                vec3 fresnel = f0 + (1.0 - f0) * pow(1.0 - VdotH, 5.0);

                float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
                float geometry = NdotL / (NdotL * (1.0 - k) + k) * NdotV / (NdotV * (1.0 - k) + k);

                float alpha = roughness * roughness;
                float alpha2 = alpha * alpha;
                float denom = NdotH * NdotH * (alpha2 - 1.0) + 1.0;
                float distribution = alpha2 / (3.14159265 * denom * denom);

                vec3 specular = fresnel * geometry * distribution / max(4.0 * NdotL * NdotV, 0.001);
                vec3 diffuse = (1.0 - fresnel) * (1.0 - metallic) * baseColor.rgb / 3.14159265;

                // Ambient: moderate base with directional sun contrast
                vec3 ambient = mix(0.15 * baseColor.rgb, 0.25 * baseColor.rgb, u_sunIntensity);

                // Sun contribution
                float sunLight = NdotL * u_sunIntensity;

                vec3 finalColor;
                if (metallic > 0.5) {
                    // Metallic surfaces: boost dark textures to aluminium brightness
                    // Preserve texture variation but lift into bright reflective range
                    float luma = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
                    vec3 metalBase = luma < 0.4
                        ? mix(baseColor.rgb, vec3(0.85), 0.7)  // lift dark metals to bright aluminium
                        : baseColor.rgb;

                    vec3 reflectDir = reflect(-sunDir, normal);
                    float specHighlight = pow(max(dot(viewDir, reflectDir), 0.0), 24.0);
                    vec3 metalColor = metalBase * NdotL * u_sunIntensity;
                    vec3 metalSpec = vec3(1.0, 0.98, 0.9) * specHighlight * 3.0 * u_sunIntensity;
                    // Dark side reflects space — nearly black, tiny earthshine
                    finalColor = metalBase * 0.03 + metalColor + metalSpec;
                } else {
                    finalColor = ambient + (diffuse * 2.5 + specular * 3.0) * sunLight;
                }

                gl_FragColor = vec4(finalColor, baseColor.a);
            }
        `;this.pbrProgram=o.createProgramInfo(t,[a,n]),this.pbrProgram.program||console.error("Failed to create PBR shader program");const r=`
            attribute vec3 position;
            attribute vec4 color;
            uniform mat4 u_worldViewProjection;
            varying vec4 v_color;
            void main() {
                gl_Position = u_worldViewProjection * vec4(position, 1.0);
                v_color = color;
            }
        `,c=`
            precision mediump float;
            varying vec4 v_color;
            void main() {
                gl_FragColor = v_color;
            }
        `;this.wireProgram=o.createProgramInfo(t,[r,c])}_slerpVec(t,o,i,l){let a=Math.max(-1,Math.min(1,twgl.v3.dot(t,o)));if(a>.9999)return twgl.v3.normalize(o);let n=o;if(a<-.99){let m;l&&twgl.v3.length(twgl.v3.cross(t,l))>.001?m=twgl.v3.normalize(l):(m=twgl.v3.cross(t,[0,1,0]),twgl.v3.length(m)<.001&&(m=twgl.v3.cross(t,[1,0,0])),m=twgl.v3.normalize(m)),i<.5?(n=m,i=i*2):(t=m,n=o,i=(i-.5)*2),a=Math.max(-1,Math.min(1,twgl.v3.dot(t,n)))}const r=Math.acos(a),c=Math.sin(r);if(c<.001)return twgl.v3.normalize(n);const s=Math.sin((1-i)*r)/c,u=Math.sin(i*r)/c;return twgl.v3.normalize([s*t[0]+u*n[0],s*t[1]+u*n[1],s*t[2]+u*n[2]])}_renderActiveModel(t,o,i,l,a,n,r,c,s,u,m,d,f){const e=this.models[t],p=e&&e.cameraDistance||15,v=twgl.v3.normalize(o),A=v;let M;if(m){const g=twgl.v3.subtract(m,twgl.v3.mulScalar(A,twgl.v3.dot(m,A)));M=twgl.v3.length(g)>.001?twgl.v3.normalize(g):twgl.v3.normalize(twgl.v3.cross(v,[0,1,0]))}else{const g=twgl.v3.cross(v,[0,1,0]);M=twgl.v3.length(g)>.001?twgl.v3.normalize(g):twgl.v3.normalize([1,0,0])}const T=v,E=twgl.v3.normalize(twgl.v3.cross(T,M));let P,x;if(a==="earth")P=[0,-1,0],x=[0,0,1];else if(a==="sun"&&c){const g=[twgl.v3.dot(c,E),twgl.v3.dot(c,T),twgl.v3.dot(c,M)];P=twgl.v3.normalize(g);const _=[0,1,0];x=twgl.v3.normalize([twgl.v3.dot(_,E),twgl.v3.dot(_,T),twgl.v3.dot(_,M)])}else if(a==="moon"&&d){const g=twgl.v3.normalize(twgl.v3.subtract(d,o)),_=[twgl.v3.dot(g,E),twgl.v3.dot(g,T),twgl.v3.dot(g,M)];P=twgl.v3.normalize(_);const w=[0,1,0];x=twgl.v3.normalize([twgl.v3.dot(w,E),twgl.v3.dot(w,T),twgl.v3.dot(w,M)])}else a==="reverse"?(P=[0,0,-1],x=[0,1,0]):(P=[0,0,1],x=[0,1,0]);e._currentBoom||(e._currentBoom=P),e._currentOrbitUp||(e._currentOrbitUp=x);const S=Math.max(-1,Math.min(1,twgl.v3.dot(e._currentBoom,P)));if(S<.9999)if(f!==void 0&&f<.999){e._boomSlerpStart||(e._boomSlerpStart=[...e._currentBoom],e._upSlerpStart=[...e._currentOrbitUp]);const _=Math.max(0,Math.min(1,f));e._currentBoom=this._slerpVec(e._boomSlerpStart,P,_,x),e._currentOrbitUp=this._slerpVec(e._upSlerpStart,x,_)}else{e._boomSlerpStart=null,e._upSlerpStart=null;const _=Math.acos(S),w=.07,b=Math.sin(_);if(b>.001){const C=Math.sin((1-w)*_)/b,R=Math.sin(w*_)/b;e._currentBoom=twgl.v3.normalize([C*e._currentBoom[0]+R*P[0],C*e._currentBoom[1]+R*P[1],C*e._currentBoom[2]+R*P[2]])}else e._currentBoom=P}else e._currentBoom=P,e._boomSlerpStart=null,e._upSlerpStart=null;e._boomSlerpStart||(twgl.v3.dot(e._currentOrbitUp,x)<.999?e._currentOrbitUp=twgl.v3.normalize(twgl.v3.add(twgl.v3.mulScalar(e._currentOrbitUp,.93),twgl.v3.mulScalar(x,.07))):e._currentOrbitUp=x),x=e._currentOrbitUp;let h=e._currentBoom;const y=l||0,D=i||0;if(Math.abs(y)>.001){const g=Math.cos(y),_=Math.sin(y),w=twgl.v3.dot(x,h),b=twgl.v3.cross(x,h);h=twgl.v3.normalize(twgl.v3.add(twgl.v3.add(twgl.v3.mulScalar(h,g),twgl.v3.mulScalar(b,_)),twgl.v3.mulScalar(x,w*(1-g))))}const j=twgl.v3.normalize(twgl.v3.cross(x,h));if(Math.abs(D)>.001){const g=Math.cos(-D),_=Math.sin(-D),w=twgl.v3.dot(j,h),b=twgl.v3.cross(j,h);h=twgl.v3.normalize(twgl.v3.add(twgl.v3.add(twgl.v3.mulScalar(h,g),twgl.v3.mulScalar(b,_)),twgl.v3.mulScalar(j,w*(1-g))))}let L,H,U;if(window._portholeMode){const g=window._portholeModelOffset||[0,0,0];L=[g[0],g[1],g[2]];const _=l||0,w=i||0,b=[Math.sin(_)*Math.cos(w),Math.sin(w),Math.cos(_)*Math.cos(w)];H=[L[0]+b[0],L[1]+b[1],L[2]+b[2]],U=[0,1,0]}else L=twgl.v3.mulScalar(h,-p),H=[0,0,0];if(!window._portholeMode){const g=twgl.v3.normalize(L);Math.abs(twgl.v3.dot(g,x))>.99?(U=twgl.v3.normalize(twgl.v3.cross(g,[1,0,0])),twgl.v3.length(U)<.001&&(U=[0,0,1])):U=x,window.debug_camera&&(L[0]=window.debug_camera[0],L[1]=window.debug_camera[1],L[2]=window.debug_camera[2])}const K=r,q=n,tt=twgl.m4.perspective(q,K,.1,1e3),et=twgl.m4.lookAt(L,H,U),ot={viewProjectionMatrix:twgl.m4.multiply(tt,twgl.m4.inverse(et)),position:L},nt=e&&e.screenOffset||0,rt=twgl.v3.mulScalar(U,nt),O=.1;let N=null;if(e&&e.progradeAxis){const g=twgl.v3.normalize(e.progradeAxis),_=[0,0,1],w=twgl.v3.dot(g,_);if(w<-.9999){const b=Math.abs(g[0])<.9?[1,0,0]:[0,1,0];N=twgl.m4.axisRotation(twgl.v3.normalize(twgl.v3.cross(g,b)),Math.PI)}else if(w<.9999){const b=twgl.v3.normalize(twgl.v3.cross(g,_));N=twgl.m4.axisRotation(b,Math.acos(Math.max(-1,Math.min(1,w))))}if(e.nadirAxis&&N){const b=twgl.v3.normalize(twgl.m4.transformDirection(N,e.nadirAxis)),C=[0,-1,0],R=twgl.v3.normalize([b[0],b[1],0]),I=twgl.v3.normalize([C[0],C[1],0]),F=Math.max(-1,Math.min(1,twgl.v3.dot(R,I)));let B=Math.acos(F);twgl.v3.cross(R,I)[2]<0&&(B=-B),N=twgl.m4.multiply(twgl.m4.axisRotation([0,0,1],B),N)}}let $=null;if(e&&e.tumble&&u){if(!e._tumbleAxis){const _=Math.random()-.5,w=Math.random()-.5,b=Math.random()-.5,C=Math.sqrt(_*_+w*w+b*b);e._tumbleAxis=[_/C,w/C,b/C]}if(Math.abs(u.getSpeed())<=10){const _=u.now()/1e3;e._tumbleLastAngle=_*e.tumble}e._tumbleLastAngle!==void 0&&($=twgl.m4.axisRotation(e._tumbleAxis,e._tumbleLastAngle))}let X=N;$&&(X=N?twgl.m4.multiply($,N):$);const Y={position:twgl.v3.mulScalar(rt,O),rotation:[0,0,0],scale:[O,O,O],tumbleMatrix:X},V=c,J=o,Q=twgl.v3.dot(J,V);let k=!0;if(Q<0){const g=twgl.v3.subtract(J,twgl.v3.mulScalar(V,Q));twgl.v3.length(g)<1&&(k=!1)}const st=[twgl.v3.dot(V,E),twgl.v3.dot(V,T),twgl.v3.dot(V,M)];let z=twgl.v3.normalize(st);if(e&&(e.faceSun||e.faceEarth)){const g=[0,-1,0],_=twgl.v3.normalize(e.faceEarth||e.faceSun),w=e.faceEarth?g:z,b=twgl.v3.dot(_,w);let C=twgl.m4.identity();if(b<-.9999){const R=Math.abs(_[0])<.9?[1,0,0]:[0,1,0],I=twgl.v3.normalize(twgl.v3.cross(_,R));C=twgl.m4.axisRotation(I,Math.PI)}else if(b<.9999){const R=twgl.v3.normalize(twgl.v3.cross(_,w)),I=Math.acos(Math.max(-1,Math.min(1,b)));C=twgl.m4.axisRotation(R,I)}if(e.solarAxis){const R=e.faceEarth?z:g,I=twgl.m4.transformDirection(C,e.solarAxis),F=twgl.v3.subtract(I,twgl.v3.mulScalar(w,twgl.v3.dot(I,w))),B=twgl.v3.subtract(R,twgl.v3.mulScalar(w,twgl.v3.dot(R,w)));if(twgl.v3.length(F)>.001&&twgl.v3.length(B)>.001){const W=twgl.v3.normalize(F),Z=twgl.v3.normalize(B),mt=Math.max(-1,Math.min(1,twgl.v3.dot(W,Z)));let G=Math.acos(mt);const ft=twgl.v3.cross(W,Z);twgl.v3.dot(ft,w)<0&&(G=-G);const dt=twgl.m4.axisRotation(w,G);C=twgl.m4.multiply(dt,C)}}Y.tumbleMatrix=C}const it={sunDirection:z,lightDirection:k?[1,1,1]:[.1,.1,.1],sunIntensity:k?1:0};if(e._sarjNodes){const g=typeof window._sarjOffset=="number"?window._sarjOffset:-.2;let w=(typeof window._sarjSign=="number"?window._sarjSign:1)*Math.atan2(z[2],z[1])+g;for(e._sarjAngle===void 0&&(e._sarjAngle=w);w-e._sarjAngle>Math.PI;)w-=2*Math.PI;for(;w-e._sarjAngle<-Math.PI;)w+=2*Math.PI;let b=w-e._sarjAngle;const C=.09;b=Math.max(-C,Math.min(C,b)),e._sarjAngle+=b;const R=e._sarjAngle/2,I=[Math.sin(R),0,0,Math.cos(R)];for(const F of e._sarjNodes)e.nodes[F]&&(e.nodes[F].rotation=I)}if(e._bgaSolarNodes&&e._bgaSolarNodes.length>0){e._bgaAngles||(e._bgaAngles={});for(const g of e._bgaSolarNodes){const _=e.nodes[g];if(!_)continue;let w=Math.PI/2;if(k){const R=-(e._sarjAngle||0),I=Math.cos(R),F=Math.sin(R);I*z[1]-F*z[2];const B=F*z[1]+I*z[2];w=Math.atan2(z[0],B)+Math.PI/2}e._bgaAngles[g]===void 0&&(e._bgaAngles[g]=w);let b=w-e._bgaAngles[g];b>Math.PI&&(b-=2*Math.PI),b<-Math.PI&&(b+=2*Math.PI),b=Math.max(-.06,Math.min(.06,b)),e._bgaAngles[g]+=b;const C=e._bgaAngles[g]/2;_.rotation=[0,0,Math.sin(C),Math.cos(C)]}}const at=s.getParameter(s.DEPTH_TEST),lt=s.getParameter(s.CULL_FACE),ct=s.getParameter(s.BLEND),ut=s.getParameter(s.DEPTH_FUNC);s.enable(s.DEPTH_TEST),s.depthFunc(s.LEQUAL),s.enable(s.CULL_FACE),s.cullFace(s.BACK),s.disable(s.BLEND),s.clear(s.DEPTH_BUFFER_BIT),this.render(t,Y,ot,it),at?s.enable(s.DEPTH_TEST):s.disable(s.DEPTH_TEST),lt?s.enable(s.CULL_FACE):s.disable(s.CULL_FACE),ct?s.enable(s.BLEND):s.disable(s.BLEND),s.depthFunc(ut)}render(t,o={},i={},l={}){if(t<0||t>=this.models.length){console.warn(`Invalid model index: ${t}`);return}this.gl;const a=this.twgl,n=this.models[t];this._drawCallCount=0,this._primitiveCount=0;const r={...this.defaultTransform,...o},c=this.createWorldMatrix(r),s=i.viewProjectionMatrix||a.m4.identity(),u=a.m4.multiply(s,c),m=l.lightDirection||[1,1,1],d=l.sunDirection||[1,1,.5],f=l.sunIntensity!==void 0?l.sunIntensity:1,e=i.position||[0,0,5],p=a.m4.identity();if(n.gltf.scenes&&n.gltf.scenes.length>0){const v=n.gltf.scenes[n.gltf.scene||0];if(v.nodes)for(const A of v.nodes)this.renderNode(n,A,p,u,m,e,c,d,f)}else for(let v=0;v<n.nodes.length;v++)!n.nodes.some(M=>M.children&&M.children.includes(v))&&this.renderNode(n,v,p,u,m,e,c,d,f)}renderNode(t,o,i,l,a,n,r,c,s=1){if(o>=t.nodes.length)return;const u=this.gl,m=this.twgl,d=t.nodes[o];let f=i;if(d.matrix)f=m.m4.multiply(i,d.matrix);else if(d.translation||d.rotation||d.scale){const e=d.translation||[0,0,0],p=d.rotation||[0,0,0,1],v=d.scale||[1,1,1],A=m.m4.translation(e),M=this.quaternionToMatrix(p),T=m.m4.scaling(v),E=m.m4.multiply(m.m4.multiply(A,M),T);f=m.m4.multiply(i,E)}if(d.mesh!==void 0&&d.mesh<t.meshes.length){const e=t.meshes[d.mesh];this._drawCallCount||(this._drawCallCount=0,this._primitiveCount=0);for(const p of e.primitives){if(this._primitiveCount++,this._drawCallCount++,p.mode===1&&this.wireProgram){u.useProgram(this.wireProgram.program);const y=m.m4.multiply(l,f);m.setUniforms(this.wireProgram,{u_worldViewProjection:y}),m.setBuffersAndAttributes(u,this.wireProgram,p.bufferInfo),m.drawBufferInfo(u,p.bufferInfo,p.mode);continue}const v=p.material,M=v&&v.pbrMetallicRoughness?this.pbrProgram:this.simpleProgram;u.useProgram(M.program);const T=p.materialIndex,E=t.isReflectiveMaterial&&T!==void 0&&T!==null&&t.isReflectiveMaterial.has(T),P=v&&v.name&&(v.name.toLowerCase().includes("shiny")||v.name.toLowerCase().includes("panel")||v.name.toLowerCase().includes("foil")||v.name.toLowerCase().includes("metal"));if((E||P)&&!this._loggedReflective){console.log("FOUND REFLECTIVE! Rendering reflective material:",{materialIndex:T,material:v?v.name:"none",sunIntensity:s,isReflective:E,debugForceReflective:P}),this._loggedReflective=!0;const y=u.getUniformLocation(M.program,"u_sunIntensity");console.log("u_sunIntensity uniform location:",y)}const x=m.m4.multiply(l,f),h={u_world:m.m4.multiply(r,f),u_worldViewProjection:x,u_lightDirection:a,u_viewPosition:n,u_sunDirection:c,u_sunIntensity:s,u_baseColorFactor:[1,1,1,1],u_hasBaseColorTexture:!1,u_metallicFactor:1,u_roughnessFactor:1,u_hasMetallicRoughnessTexture:!1,u_hasNormalTexture:!1};if(v){if(v.pbrMetallicRoughness){const y=v.pbrMetallicRoughness;if(y.baseColorFactor&&(h.u_baseColorFactor=y.baseColorFactor),y.baseColorTexture){const D=y.baseColorTexture.index;t.textures.has(D)&&(h.u_baseColorTexture=t.textures.get(D),h.u_hasBaseColorTexture=!0)}if(y.metallicFactor!==void 0&&(h.u_metallicFactor=y.metallicFactor),y.roughnessFactor!==void 0&&(h.u_roughnessFactor=y.roughnessFactor),y.metallicRoughnessTexture){const D=y.metallicRoughnessTexture.index;t.textures.has(D)&&(h.u_metallicRoughnessTexture=t.textures.get(D),h.u_hasMetallicRoughnessTexture=!0)}}if(v.normalTexture){const y=v.normalTexture.index;t.textures.has(y)&&(h.u_normalTexture=t.textures.get(y),h.u_hasNormalTexture=!0)}}m.setUniforms(M,h),m.setBuffersAndAttributes(u,M,p.bufferInfo),m.drawBufferInfo(u,p.bufferInfo,p.mode)}}if(d.children)for(const e of d.children)this.renderNode(t,e,f,l,a,n,r,c,s);o===0&&(this._lastDrawCallCount=this._drawCallCount,this._lastPrimitiveCount=this._primitiveCount)}animateNodeRotation(t,o,i,l="Y"){if(t<0||t>=this.models.length){console.warn(`Invalid model index: ${t}`);return}const a=this.models[t],n=a.nodes.findIndex(u=>u.name===o);if(n===-1){console.warn(`Node "${o}" not found in model`),console.log("Available nodes:",a.nodes.map(u=>u.name).filter(u=>u));return}const r=a.nodes[n];r.originalRotation||(r.originalRotation=r.rotation?[...r.rotation]:[0,0,0,1]);const c=l==="X"?[1,0,0]:l==="Y"?[0,1,0]:[0,0,1],s=this.axisAngleToQuaternion(c,i);r.rotation=this.multiplyQuaternions(r.originalRotation,s),console.log(`Animated node "${o}" by ${(i*180/Math.PI).toFixed(1)}° around ${l} axis`)}axisAngleToQuaternion(t,o){const i=o*.5,l=Math.sin(i);return[t[0]*l,t[1]*l,t[2]*l,Math.cos(i)]}multiplyQuaternions(t,o){return[t[3]*o[0]+t[0]*o[3]+t[1]*o[2]-t[2]*o[1],t[3]*o[1]-t[0]*o[2]+t[1]*o[3]+t[2]*o[0],t[3]*o[2]+t[0]*o[1]-t[1]*o[0]+t[2]*o[3],t[3]*o[3]-t[0]*o[0]-t[1]*o[1]-t[2]*o[2]]}getNodeNames(t){return t<0||t>=this.models.length?[]:this.models[t].nodes.map((o,i)=>({index:i,name:o.name||`Node_${i}`})).filter(o=>o.name)}_reparentISSPanels(t){var u,m,d;const o=t.nodes,i=[],l=[];for(let f=0;f<o.length;f++){const e=(u=o[f])==null?void 0:u.name;e&&((e==="alpha-1"||e==="alpha-2")&&i.push(f),e.match(/^solar-[1-4]$/)&&l.push(f))}if(i.length>=2){t._sarjNodes=i,t._bgaSolarNodes=l,console.log(`ISS (v5): SARJ joints: ${i.map(f=>`${f}:${o[f].name}`).join(", ")}`,`
  BGA panels: ${l.map(f=>`${f}:${o[f].name}`).join(", ")}`);return}const a=(m=t.gltf.scenes)==null?void 0:m[t.gltf.scene||0];if(!(a!=null&&a.nodes)||!o[60]||!o[75])return;const n=75,r=60,c={[n]:o[n].translation||[0,0,0],[r]:o[r].translation||[0,0,0]},s=[];for(let f=114;f<=129;f++)f<o.length&&((d=o[f])!=null&&d.name)&&s.push(f);for(const f of s){const e=o[f],p=e.name.endsWith("_p")||e.name.includes("_p.")?n:r;e.translation&&c[p]&&(e.translation=[e.translation[0]-c[p][0],e.translation[1]-c[p][1],e.translation[2]-c[p][2]]),o[p].children||(o[p].children=[]),o[p].children.push(f);const v=a.nodes.indexOf(f);v!==-1&&a.nodes.splice(v,1)}t._sarjNodes=[n,r],console.log(`ISS (legacy): re-parented ${s.length} nodes under SARJ`)}_setupOrionPanels(t){var l,a;const o=t.nodes,i=[];for(let n=0;n<o.length;n++){if(!((a=(l=o[n])==null?void 0:l.name)!=null&&a.startsWith("Solar handle")))continue;i.push(n);const r=o[n].translation||[0,0,0];let c;r[0]>0&&r[2]>0?c=45:r[0]<0&&r[2]>0?c=135:r[0]<0&&r[2]<0?c=-135:c=-45;const u=c*Math.PI/180/2;o[n].rotation=[0,Math.sin(u),0,Math.cos(u)]}i.length>0&&(t._orionSolarHandles=i,console.log(`Orion: ${i.length} solar handles set to X-pattern: ${i.map(n=>`${n}:${o[n].name}`).join(", ")}`))}quaternionToMatrix(t){const[o,i,l,a]=t,n=Math.sqrt(o*o+i*i+l*l+a*a),r=o/n,c=i/n,s=l/n,u=a/n,m=r*r,d=c*c,f=s*s,e=r*c,p=r*s,v=c*s,A=u*r,M=u*c,T=u*s;return[1-2*(d+f),2*(e-T),2*(p+M),0,2*(e+T),1-2*(m+f),2*(v-A),0,2*(p-M),2*(v+A),1-2*(m+d),0,0,0,0,1]}createWorldMatrix(t){const o=this.twgl,i=o.m4.translation(t.position),l=o.m4.rotationX(t.rotation[0]),a=o.m4.rotationY(t.rotation[1]),n=o.m4.rotationZ(t.rotation[2]),r=o.m4.scaling(t.scale);let c;return t.tumbleMatrix?c=t.tumbleMatrix:c=o.m4.multiply(o.m4.multiply(n,a),l),o.m4.multiply(o.m4.multiply(i,c),r)}mapAttributeName(t){return{POSITION:"position",NORMAL:"normal",TEXCOORD_0:"texcoord",TEXCOORD_1:"texcoord1",COLOR_0:"color",TANGENT:"tangent",JOINTS_0:"joints",WEIGHTS_0:"weights"}[t]||t.toLowerCase()}getTypedArrayConstructor(t){switch(t){case 5120:return Int8Array;case 5121:return Uint8Array;case 5122:return Int16Array;case 5123:return Uint16Array;case 5125:return Uint32Array;case 5126:return Float32Array;default:throw new Error(`Unknown component type: ${t}`)}}getElementSize(t){switch(t){case"SCALAR":return 1;case"VEC2":return 2;case"VEC3":return 3;case"VEC4":return 4;case"MAT2":return 4;case"MAT3":return 9;case"MAT4":return 16;default:throw new Error(`Unknown accessor type: ${t}`)}}clearCache(t){this.modelCache.delete(t)}clearAllCache(){this.modelCache.clear(),this.models=[],this.activeModelIndex=null}getModelInfo(t){if(t<0||t>=this.models.length)return null;const o=this.models[t];return{meshCount:o.meshes.length,nodeCount:o.nodes.length,materialCount:o.materials.length,textureCount:o.textures.size,hasAnimations:o.gltf.animations&&o.gltf.animations.length>0}}}export{pt as BlueGlobeModelRenderer,pt as default};

FROM node:16

RUN cp /usr/share/zoneinfo/Israel /etc/localtime && echo "Israel" >  /etc/timezone
  
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg



 # Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [   "npm", "audit" ]
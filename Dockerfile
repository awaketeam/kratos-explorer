FROM geoffreybooth/meteor-base:1.10.2

RUN apt update -y
RUN apt install nginx -y
RUN apt install curl -y
RUN apt install nodejs -y
RUN apt install python2 python2-dev -y
RUN apt install python3 python3-dev python3-pip -y
RUN apt install pkg-config -y
RUN apt-get install libleveldb-dev libsecp256k1-dev -y
RUN apt-get install sudo -y
RUN pip3 install pykg-config 
RUN pip3 install secp256k1
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt install nodejs -y
RUN npm install pm2 -g

RUN adduser --disabled-password --gecos '' ubuntu
RUN adduser ubuntu sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

COPY package*.json $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

workdir $APP_SOURCE_FOLDER
COPY . $APP_SOURCE_FOLDER/

RUN sudo mkdir -p $APP_BUNDLE_FOLDER

RUN chown -R ubuntu $APP_SOURCE_FOLDER
RUN chown -R ubuntu $SCRIPTS_FOLDER
RUN chown -R ubuntu $APP_BUNDLE_FOLDER

USER ubuntu

RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh
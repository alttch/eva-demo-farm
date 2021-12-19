from altertech/eva-ics:3.4.2-2021121201-38
ADD deploy /deploy
RUN mkdir /opt/sse
COPY .online/_sse.sh /opt/sse/
COPY .online/_online-demo-initial-generator.py /opt/sse/
COPY simulate_se.py /opt/sse/
ADD .online/setup /setup

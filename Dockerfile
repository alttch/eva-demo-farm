from altertech/eva-ics:3.3.2-2021040205-24
ADD deploy /deploy
RUN mkdir /opt/sse
COPY .online/crond-supervisor.conf /etc/supervisor/conf.d/crond.conf
COPY .online/_sse.sh /opt/sse/
COPY .online/_online-demo-initial-generator.py /opt/sse/
COPY simulate_se.py /opt/sse/
RUN echo "*	*	*	*	*	/opt/sse/_sse.sh" >> /var/spool/cron/crontabs/root

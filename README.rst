EVA ICS demo: Farm management
*****************************

Live demo
=========

@ https://farm.demo.eva-ics.com/

Layout
======

This demo deploys `EVA ICS <https://www.eva-ics.com/>`_ cluster to control
virtual farm with two greenhouses.

Each greenhouse has own Universal Controller instance, which collects data from
sensors:

* greenhouseX/env/temp - temperature
* greenhouseX/env/hum - humidity
* greenhouseX/env/soilm - soil moisture
* greenhouseX/env/ldr - light sensor (1 - ok, 0 - low)

Also, greenhouses are equipped with units:

* greenhouseX/pump - water pump
* greenhouseX/lamp - lighting lamps circuit

which can be turned on/off by operator or PLC.

In this setup, units use virtual relay drivers, port 1 for pump, port 2 for
lamps. Sensors don't use any driver, user can set their values manually and
simulate different events.

Logic
=====

LM PLC has the following rules:

* If ldr sensor in greenhouse becomes 0 - turn the light on, otherwise turn the
  light off

* If soil becomes too dry ( < 85) - turn the pump on, if too wet ( > 110) -
  turn the pump off

* If the pump is turned on by operator, it should be automatically turned off
  in 30 seconds for greenhouse 1, in 45 seconds for greenhouse 2

* The pump should not be automatically turned off if it was turned on by
  operator but then measure monitoring detected that soil is dry

* macro **start_manual_watering** is called by operator, other macros are
  called by decision rules.

* Rules and automatic macros are programmed in universal way to use item props
  and **_source** object (in macros) to determine the event-related items. This
  allows the cluster to be extended with more greenhouses without creating any
  new macros.

Network and containers
======================

* Both UCs are set up on dedicated nodes and dynamically discovered by LM/SFA
  and exchange data via MQTT server

* SFA and LM PLC are set up on the same node and statically connected via HTTP
  and exchange data via P2P connection

* **eva_farm_mqtt** local MQTT server (mosquitto), *10.27.12.200*
* **eva_farm_uc1** UC in greenhouse 1, *10.27.12.101*
* **eva_farm_uc2** UC in greenhouse 2, *10.27.12.102*
* **eva_farm_scada** *10.27.12.199*
 * LM PLC (logic controller)
 * SFA (aggregator, UI)

Deployment
==========

Requirements: `Docker <https://www.docker.com/>`_, `docker-compose
<https://docs.docker.com/compose/>`_.

* Execute *docker-compose up* to deploy containers and demo configuration

Management
==========

API
---

Default master key is: *demo123*

http://10.27.12.199:8828 - SFA API/primary operator interface

Components:

* http://10.27.12.101:8812 - UC in greenhouse 1 API/EI
* http://10.27.12.102:8812 - UC in greenhouse 2 API/EI
* http://10.27.12.199:8817 - LM PLC API/EI

The port **8828** is also mapped to main host.

UI
--

http://10.27.12.199:8828

SFA user credentials:

* **login** *operator*
* **password** *123*

CLI
---

CLI management:
    
    *docker exec -it <container_name> eva-shell*

e.g. enter **eva_farm_scada** node shell:

    *docker exec -it eva_farm_scada eva-shell*

Event simulation
----------------

Sensor events can be simulated with:

    *./sensor-set.sh <greenhouse_number> <temp|hum|soilm|ldr> <value>*


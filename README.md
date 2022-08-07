# b8b_virtuoso

IRI: http://beatbytebot.web.app/resource/

SELECT * WHERE { ?s ?p ?o . }

SELECT DISTINCT ?o WHERE { ?s ?p ?o . }

select distinct ?audioprojects where {?audioprojects rdf:type <http://beatbytebot.web.app/ontology/AudioProject>.}

select distinct ?audiotracks where {?audiotracks rdf:type <http://beatbytebot.web.app/ontology/AudioTrack>.}

select distinct ?class where {[] a ?class} 

// GET PROPS FROM CLASS
select distinct ?property ?object where {<http://beatbytebot.web.app/ontology/##ID##> ?property ?object.}


PREFIX b8b:  <http://beatbytebot.web.app/ontology/>
select distinct * where {b8b:%21001374355813 ?prop ?info}
 	

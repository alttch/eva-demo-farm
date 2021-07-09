if event.type == CS_EVENT_PKG_INSTALL:
    import os
    logger.warning(f'Installing EVA Farm demo')
    extract_package()
    if os.path.exists('/opt/sse/_online-demo-initial-generator.py'):
        logger.info('Generating stats')
        code = os.system(f'cd /opt/sse && python '
                         '/opt/sse/_online-demo-initial-generator.py')
        if code:
            raise RuntimeError(f'generator failed with code {code}')
    logger.info('Farm demo setup completed')

package com.wheremoney.modules.emailcodeverification.service;

import com.wheremoney.common.exception.BusinessException;
import com.wheremoney.common.response.ResponseCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class VerificationEmailService {

  private final ObjectProvider<JavaMailSender> mailSenderProvider;
  private final String mailUsername;
  private final String fromName;

  public VerificationEmailService(
      ObjectProvider<JavaMailSender> mailSenderProvider,
      @Value("${spring.mail.username:}") String mailUsername,
      @Value("${email.from-name:${app.email.from-name:WhereMoney}}") String fromName) {
    this.mailSenderProvider = mailSenderProvider;
    this.mailUsername = mailUsername;
    this.fromName = fromName;
  }

  public void sendLoginCode(String to, String code, int expiresInSeconds) {
    if (!StringUtils.hasText(mailUsername)) {
      throw new BusinessException(
          ResponseCode.VERIFICATION_CODE_SEND_FAILED, "mail username is not configured");
    }
    JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
    if (mailSender == null) {
      throw new BusinessException(
          ResponseCode.VERIFICATION_CODE_SEND_FAILED, "mail sender is not configured");
    }

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
      helper.setFrom(mailUsername, fromName);
      helper.setTo(to);
      helper.setSubject("WhereMoney 登录验证码");
      helper.setText(buildText(code, expiresInSeconds));
      mailSender.send(message);
    } catch (MessagingException | UnsupportedEncodingException | MailException exception) {
      throw new BusinessException(ResponseCode.VERIFICATION_CODE_SEND_FAILED, "验证码邮件发送失败，请稍后重试");
    }
  }

  private String buildText(String code, int expiresInSeconds) {
    return """
        你好，

        你的 WhereMoney 登录验证码是：%s

        验证码将在 %d 秒后失效。如果不是你本人操作，请忽略这封邮件。

        WhereMoney
        """
        .formatted(code, expiresInSeconds);
  }
}
